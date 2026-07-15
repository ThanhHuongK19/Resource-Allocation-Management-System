package com.example.rams.controller;

import com.example.rams.dto.AiRecommendationRequest;
import com.example.rams.dto.AiRecommendationResponse;
import com.example.rams.dto.AiRiskRequest;
import com.example.rams.dto.AiRiskResponse;
import com.example.rams.service.AiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/recommendations")
    public ResponseEntity<AiRecommendationResponse> recommendations(@Valid @RequestBody AiRecommendationRequest request) {
        AiRecommendationResponse resp = aiService.recommend(request);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/risk-detection")
    public ResponseEntity<AiRiskResponse> riskDetection(@RequestBody java.util.Map<String, Object> payload) {
        // Accept flexible JSON payloads to avoid binding errors from strict record mapping.
        String role = null;
        Integer needed = null;
        try {
            if (payload.containsKey("roleKeyword")) role = String.valueOf(payload.get("roleKeyword"));
            else if (payload.containsKey("role")) role = String.valueOf(payload.get("role"));

            if (payload.containsKey("neededCount")) {
                Object n = payload.get("neededCount");
                if (n instanceof Number) needed = ((Number) n).intValue();
                else needed = Integer.parseInt(String.valueOf(n));
            } else if (payload.containsKey("needed")) {
                Object n = payload.get("needed");
                if (n instanceof Number) needed = ((Number) n).intValue();
                else needed = Integer.parseInt(String.valueOf(n));
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }

        AiRiskRequest req = new AiRiskRequest(role, needed);
        AiRiskResponse resp = aiService.detectRisk(req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/risk-detection-debug")
    public ResponseEntity<java.util.Map<String, Object>> riskDetectionDebug(@RequestBody java.util.Map<String, Object> payload) {
        // Echo parsed values to help debugging clients
        String role = null;
        Integer needed = null;
        try {
            if (payload.containsKey("roleKeyword")) role = String.valueOf(payload.get("roleKeyword"));
            else if (payload.containsKey("role")) role = String.valueOf(payload.get("role"));

            if (payload.containsKey("neededCount")) {
                Object n = payload.get("neededCount");
                if (n instanceof Number) needed = ((Number) n).intValue();
                else needed = Integer.parseInt(String.valueOf(n));
            } else if (payload.containsKey("needed")) {
                Object n = payload.get("needed");
                if (n instanceof Number) needed = ((Number) n).intValue();
                else needed = Integer.parseInt(String.valueOf(n));
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "invalid payload"));
        }
        return ResponseEntity.ok(java.util.Map.of("roleKeyword", role, "neededCount", needed, "received", payload));
    }
}
