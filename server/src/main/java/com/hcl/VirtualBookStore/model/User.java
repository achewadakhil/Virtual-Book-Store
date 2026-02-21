package com.hcl.VirtualBookStore.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;

    // This tells one user has one cart 
    // Cart will be the owner table and User will be inverse so in cart user's id will be stored
    // JsonManagedRefernce tells json to serialize the inner class normally 
    // JsonBackedRefernce tells to stop
    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL)
    @JsonManagedReference
    private Cart cart;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Order> orders = new ArrayList<>();

}
