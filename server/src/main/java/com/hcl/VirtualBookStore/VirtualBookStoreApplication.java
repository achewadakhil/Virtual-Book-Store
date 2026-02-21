package com.hcl.VirtualBookStore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VirtualBookStoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(VirtualBookStoreApplication.class, args);
		System.out.println("Server is running successfully");
	}

}
