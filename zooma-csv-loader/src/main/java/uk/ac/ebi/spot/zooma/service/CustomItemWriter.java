package uk.ac.ebi.spot.zooma.service;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import uk.ac.ebi.spot.zooma.model.SimpleAnnotation;

import java.util.List;

/**
 * Created by olgavrou on 20/01/2017.
 */
public class CustomItemWriter implements ItemWriter<SimpleAnnotation> {

    @Autowired
    RestTemplate restTemplate;

    @Override
    public void write(List<? extends SimpleAnnotation> items) throws Exception {

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        for (SimpleAnnotation simpleAnnotation : items) {
            if(simpleAnnotation.getSemantictag().equals("SEMANTIC_TAG")){
                continue;
            }
            HttpEntity entity = new HttpEntity(simpleAnnotation.toString(), httpHeaders);

            ResponseEntity<String> responseEntity = restTemplate.postForEntity("http://localhost:8081/annotations", entity, String.class);
            HttpStatus status = responseEntity.getStatusCode();
            String restCall = responseEntity.getBody();
            System.out.println("status: " + status);
        }
    }
}
