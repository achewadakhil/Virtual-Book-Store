package com.hcl.VirtualBookStore.utils;

public class BookNotFoundException extends RuntimeException{
    public BookNotFoundException(String message){
        super(message);
    }
}   
