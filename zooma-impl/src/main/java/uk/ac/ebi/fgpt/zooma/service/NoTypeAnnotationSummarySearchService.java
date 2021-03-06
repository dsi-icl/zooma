package uk.ac.ebi.fgpt.zooma.service;

import uk.ac.ebi.fgpt.zooma.model.AnnotationSummary;

import java.net.URI;
import java.util.*;

/**
 * An {@link AnnotationSummarySearchServiceDecorator} that extends the functionality of an {@link
 * AnnotationSummarySearchService} decorator to support searching with two different types of
 * {@link AnnotationSummarySearchService}s.
 * <p>
 * This class performs the search of the constructor given {@link AnnotationSummarySearchService},
 * (which could be another decorator), then, if no results are acquired, makes use of the set-ed {@link
 * AnnotationSummarySearchService } to expand the search, <b>omitting the provided propertyType</b>,
 * giving the alternative of a different type of search service.
 * <p>
 * This service returns aggregated {@link AnnotationSummary} objects that represent an inferred mapping between the
 * searched property and the list of semantic tags obtained from one or more ZOOMA searches.
 *
 * Created by olgavrou on 19/05/2016.
 */
public class NoTypeAnnotationSummarySearchService extends AnnotationSummarySearchServiceDecorator {

    public NoTypeAnnotationSummarySearchService(AnnotationSummarySearchService annotationSummarySearchService) {
        super(annotationSummarySearchService);
    }

    @Override
    public Collection<AnnotationSummary> search(String propertyValuePattern, final URI[] sources, final URI[] ontologySources) {
        Collection<AnnotationSummary> annotationSummaries = NoTypeAnnotationSummarySearchService.super.search(propertyValuePattern, sources, ontologySources);
       //no propertyType given, nothing more to do
        return annotationSummaries;
    }

    @Override
    public Collection<AnnotationSummary> search(final String propertyType,
                                                final String propertyValuePattern,
                                                final URI[] sources, final URI[] ontologySources) {
        Collection<AnnotationSummary> annotationSummaries = NoTypeAnnotationSummarySearchService.super.search(propertyType, propertyValuePattern, sources, ontologySources);
        if (annotationSummaries == null || annotationSummaries.isEmpty()){
            //search without the type
            return NoTypeAnnotationSummarySearchService.super.search(propertyValuePattern, sources, ontologySources);
        }
        return annotationSummaries;
    }

    @Override
    public Collection<AnnotationSummary> searchByPreferredSources(String propertyValuePattern, List<URI> preferredSources, URI[] requiredSources, URI[] ontologySources) {
        Collection<AnnotationSummary> annotationSummaries = NoTypeAnnotationSummarySearchService.super.searchByPreferredSources(propertyValuePattern, preferredSources, requiredSources, ontologySources);
        //no propertyType given, nothing more to do
        return annotationSummaries;
    }

    @Override
    public Collection<AnnotationSummary> searchByPreferredSources(String propertyType, String propertyValuePattern, List<URI> preferredSources, URI[] requiredSources, URI[] ontologySources) {
        Collection<AnnotationSummary> annotationSummaries = NoTypeAnnotationSummarySearchService.super.searchByPreferredSources(propertyType,
                propertyValuePattern,
                preferredSources,
                requiredSources,
                ontologySources);
        if (annotationSummaries == null || annotationSummaries.isEmpty()){
            //search without the type
            return NoTypeAnnotationSummarySearchService.super.searchByPreferredSources(propertyValuePattern,
                    preferredSources,
                    requiredSources,
                    ontologySources);
        }
        return annotationSummaries;
    }
}
