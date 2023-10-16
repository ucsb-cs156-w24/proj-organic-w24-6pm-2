package edu.ucsb.cs156.organic.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
  info = @Info(
  title = "Organic",
  description = """
    <p><a href='/'>Home Page</a></p>
    <p><a href='https://github.com/ucsb-cs156/proj-organic'>proj-organic on Github</a></p>
    <p><a href='/h2-console'>H2 Console (only on localhost)</a></p>
    """     
    ),
  servers = @Server(url = "/")
)
class OpenAPIConfig {}