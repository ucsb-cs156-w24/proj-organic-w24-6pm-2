package edu.ucsb.cs156.organic.services;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;

import edu.ucsb.cs156.organic.entities.User;
import edu.ucsb.cs156.organic.models.CurrentUser;

public abstract class CurrentUserService {
  public abstract User getUser() ;
  public abstract CurrentUser getCurrentUser() ;
  public abstract Collection<? extends GrantedAuthority> getRoles();

}
