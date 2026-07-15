package com.example.rams.exception;

public class AllocationNotFoundException extends RuntimeException {

    public AllocationNotFoundException(Long id) {
        super("Allocation not found with id: " + id);
    }
}
