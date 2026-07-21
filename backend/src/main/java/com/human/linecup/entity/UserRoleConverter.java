package com.human.linecup.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class UserRoleConverter implements AttributeConverter<UserRole, String> {

    @Override
    public String convertToDatabaseColumn(UserRole attribute) {
        return attribute == null ? null : attribute.getCode();
    }

    @Override
    public UserRole convertToEntityAttribute(String dbData) {
        return UserRole.fromCode(dbData);
    }
}
