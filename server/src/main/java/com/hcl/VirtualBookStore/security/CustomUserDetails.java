package com.hcl.VirtualBookStore.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.hcl.VirtualBookStore.model.User;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails{
    
    private final User user;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        String role = user.getRole();
        if (role == null || role.isBlank()) {
            role = "USER";
        }
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getUsername(){
        return user.getEmail();
    }

    @Override
    public String getPassword(){
        return user.getPassword();
    }


    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
