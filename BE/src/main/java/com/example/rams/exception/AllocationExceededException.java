package com.example.rams.exception;

public class AllocationExceededException extends RuntimeException {

    public AllocationExceededException() {
        super("Employee allocation exceeds 100%");
    }
}
