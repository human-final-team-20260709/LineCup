package com.human.linecup.entity;

/**
 * 요청 형식은 올바르지만 현재 도메인 상태와 충돌하는 경우 사용한다.
 */
public class BusinessConflictException extends RuntimeException {

    public BusinessConflictException(String message) {
        super(message);
    }

    public BusinessConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}
