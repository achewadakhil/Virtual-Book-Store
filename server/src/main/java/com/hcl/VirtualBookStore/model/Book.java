package com.hcl.VirtualBookStore.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
// @Data Avoid using @data because it can cause trouble while using JPA with hashcode methods and all instead use
@Getter
@Setter
// @ToString Avoid this also cause during Relationships it might end up in deadlock situation
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;

    private double price;
    private String category;

    @Lob
    private String description;
    private int stock;    
}
