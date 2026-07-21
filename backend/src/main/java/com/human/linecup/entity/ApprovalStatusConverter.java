package com.human.linecup.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ApprovalStatusConverter implements AttributeConverter<ApprovalStatus, String> {

    @Override
    public String convertToDatabaseColumn(ApprovalStatus attribute) {
        return attribute == null ? null : attribute.getCode();
    }

    @Override
    public ApprovalStatus convertToEntityAttribute(String dbData) {
        return ApprovalStatus.fromCode(dbData);
    }
}
