package edu.ucsb.cs156.organic.jobs;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import edu.ucsb.cs156.organic.services.jobs.JobContext;
import edu.ucsb.cs156.organic.services.jobs.JobContextConsumer;
import lombok.Builder;

@Builder
public class TestJob implements JobContextConsumer {

    private boolean fail;
    private int sleepMs;
    
    @Override
    public void accept(JobContext ctx) throws Exception {
            // Ensure this is not null 
            Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();

            ctx.log("Hello World! from test job!");
            Thread.sleep(sleepMs);
            if (fail) {
                throw new Exception("Fail!");
            }
            ctx.log("Goodbye from test job!");
    }
}
