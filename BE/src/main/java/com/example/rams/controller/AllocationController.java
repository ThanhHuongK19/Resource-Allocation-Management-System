package com.example.rams.controller;

import com.example.rams.dto.AllocationRequest;
import com.example.rams.dto.AllocationResponse;
import com.example.rams.service.AllocationService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/allocations")
public class AllocationController {

    private final AllocationService allocationService;

    public AllocationController(AllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @PostMapping
    public ResponseEntity<AllocationResponse> create(@Valid @RequestBody AllocationRequest request) {
        AllocationResponse response = allocationService.create(request);
        return ResponseEntity.created(URI.create("/allocations/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public AllocationResponse update(@PathVariable Long id, @Valid @RequestBody AllocationRequest request) {
        return allocationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        allocationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<AllocationResponse> findAll() {
        return allocationService.findAll();
    }

    @GetMapping("/{id}")
    public AllocationResponse findById(@PathVariable Long id) {
        return allocationService.findById(id);
    }
}
