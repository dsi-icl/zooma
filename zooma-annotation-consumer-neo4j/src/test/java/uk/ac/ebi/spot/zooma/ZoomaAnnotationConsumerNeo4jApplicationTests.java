package uk.ac.ebi.spot.zooma;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.ac.ebi.spot.zooma.config.ConsumerNeoTestConfig;

@RunWith(SpringRunner.class)
@SpringBootTest
@ContextConfiguration(classes = ConsumerNeoTestConfig.class)
public class ZoomaAnnotationConsumerNeo4jApplicationTests {

	@Test
	public void contextLoads() {
	}

}