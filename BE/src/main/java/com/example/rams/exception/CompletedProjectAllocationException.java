package com.example.rams.exception;

public class CompletedProjectAllocationException extends RuntimeException {

    public CompletedProjectAllocationException() {
        super("Cannot allocate resource to a completed project");
    }
}
