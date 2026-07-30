package com.human.linecup.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WorkerSkillRequest(@NotBlank @Size(max = 100) String skillName) {
}
