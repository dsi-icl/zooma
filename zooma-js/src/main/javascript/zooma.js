/* Zooma2 Javascript client library.  This plugin enables ZOOMA autocomplete and annotation functions to be bound to appropriate elements. */

// defaults
var default_zooma_url = 'http://www.ebi.ac.uk/spot/zooma/';
var default_zooma_base_path = 'v2/api/services';
var default_logging_div = 'zooma-log';

// Declares a zooma jQuery plugin
(function($) {
    var logging; // should be one of 'console', 'div', or 'none'
    var loggingDiv; // defined if logging == 'div'

    var commands = {
        autocomplete: function(target, options) {
            var settings = extendOptions(options);
            initLogging(settings);
            return autocomplete(target, settings);
        },
        annotate: function(target, options) {
            var settings = extendOptions(options);
            initLogging(settings);
            return annotate(target, settings);
        }
    };

    var extendOptions = function(options) {
        // create some defaults and allow options to extend
        var _options = $.extend({
            'zooma_url': default_zooma_url,
            'zooma_base_path': default_zooma_base_path
        }, options);

        return $.extend({
            'zooma_suggest_path': _options.zooma_url + _options.zooma_base_path + '/suggest',
            'zooma_annotate_path': _options.zooma_url + _options.zooma_base_path + '/annotate',
            'logging': 'none',
            'loggingDiv': default_logging_div
        }, _options);
    };

    var initLogging = function(settings) {
        // setup logging
        if (settings.logging == 'console' || settings.logging == 'div' || settings.logging == 'none') {
            logging = settings.logging;
            if (logging == 'div') {
                loggingDiv = $("#" + settings.loggingDiv);
            }
        }
        else {
            throw "logging option must be one of 'console', 'div' or 'none'";
        }
    };

    var log = function(msg) {
        if (logging == 'console') {
            try {
                console.log(msg);
            }
            catch (ex) {
                console.log("Failed to log (" + ex + ")");
            }
        }
        if (logging == 'div') {
            try {
                if (loggingDiv.length == 0) {
                    // create hidden zooma-log div if it doesn't exist
                    $("body").append("<div id=\"zooma-log\" />");
                    $("#zooma-log").hide();
                }
                loggingDiv.append('<div class=\"logmessage\">' + msg + '</div>');
            }
            catch (ex) {
                loggingDiv.append("Failed to log (" + ex + ")");
            }

        }
    };

    var isFunction = function(varToCheck) {
        var getType = {};
        return varToCheck && getType.toString.call(varToCheck) === '[object Function]';
    };

    var isSelector = function(expressionToCheck) {
        try {
            var $element = $(expressionToCheck);
            log(expressionToCheck + " is a valid jQuery selector (selects " + $element + ")");
            return true;
        }
        catch (error) {
            log(error);
            return false;
        }
    };

    var pressEnter = function(target, callback) {
        var $target = $(target);
        return $target.bind('keypress', function(e) {
            if (e.keyCode == 13) {
                callback.apply(this, [e]);
            }
        });
    };

    var retrieveZoomaAnnotations = function(settings, target, property) {
        jQuery.getJSON(settings.zooma_annotate_path + "?propertyValue=" + encodeURI(property), function(data) {
            renderZoomaAnnotations(target, data);
        });
    };

    var renderZoomaAnnotations = function(target, annotations) {
        target.tagsinput('removeAll');
        $(annotations).each(function(index, element) {
            var shortnames = [];
            $(element.semanticTags).each(function(_index, _element) {
                var _parts = _element.split('/');
                var parts = _parts[_parts.length - 1].split('#');
                var shortname = parts[parts.length - 1];
                shortnames.push(shortname);
            });

            if (shortnames.length > 1) {
                var shortname = "";
                for (var i = 0; i < shortnames.length - 1; i++) {
                    shortname = shortname + shortnames[i] + " & ";
                }
                shortname = shortname + shortnames[length - 1];
                element.shortname = shortname;
            }
            else {
                if (shortnames.length > 0) {
                    element.shortname = shortnames[0];
                }
                else {
                    element.shortname = "Unknown";
                }
            }
            target.tagsinput('add', element)
        });
    };

    var autocomplete = function(target, settings) {
        var $target = $(target);

        log("Adding zooma autocomplete functionality to " + $target.attr("id") + " with configuration: " +
            JSON.stringify(settings));
        var properties = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: settings.zooma_suggest_path + '?prefix=%QUERY',
                wildcard: '%QUERY'
            }
        });

        log("Binding typeahead to " + $target.attr("id") + "...");
        $target.typeahead({
                    hint: true,
                    highlight: true,
                    minLength: 3
                },
                {
                    source: properties
                });
        log("Typeahead bound ok!");
    };

    var annotate = function(target, settings) {
        var $target = $(target);

        log("Adding zooma annotation functionality to " + $target.attr("id") + " with configuration: " +
            JSON.stringify(settings));

        // add data-role tagsinput to target and init
        $target.attr('data-role', 'tagsinput');
        $target.tagsinput({trimValue: true, itemValue: 'shortname', itemText: 'shortname'});

        log("Setup tagsinput on " + $target.attr("id") + " ok!");

        // check properties
        var source = settings.annotation_source;
        var property;
        var annotations;
        if (isFunction(source)) {
            // source is a function, invoke to get property
            property = source.apply(this, []);
            retrieveZoomaAnnotations(settings, $target, property);
        }
        else {
            if (source.is('input')) {
                // if source is an input element, track when user presses enter
                pressEnter(source, function() {
                    log("Detected enter pressed on " + source.attr("id"));
                    var property = source.val();
                    retrieveZoomaAnnotations(settings, $target, property);
                });
            }
            else {
                // otherwise, try to annotate the source directly and put results in the target
                if (isSelector(source)) {
                    retrieveZoomaAnnotations(settings, $target, $(source));
                }
                else {
                    retrieveZoomaAnnotations(settings, $target, source);
                }
            }
        }

        log("Annotation detection bound ok!");
    };

    $.fn.zooma = function(command, options) {
        if (commands[command]) {
            return this.each(function() {
                return commands[command].apply(this, [this, options]);
            });
        }
        else {
            $.error("jQuery.zooma plugin does not support the command '" + command + "'");
        }
    };
})(jQuery);