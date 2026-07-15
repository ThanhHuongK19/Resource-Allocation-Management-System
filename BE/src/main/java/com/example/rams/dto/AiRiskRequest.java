package com.example.rams.dto;

public record AiRiskRequest(
        String roleKeyword,
        Integer neededCount
) {
}
