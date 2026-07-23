package com.human.linecup.controller;

import com.human.linecup.entity.BusinessConflictException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Slf4j
@RestControllerAdvice
public class ControllerExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getAllErrors().forEach(error -> {
            String key = error instanceof FieldError fieldError
                    ? fieldError.getField()
                    : error.getObjectName();
            errors.putIfAbsent(key, error.getDefaultMessage());
        });

        ProblemDetail problem = problem(
                HttpStatus.BAD_REQUEST,
                "요청 값 검증 실패",
                "요청 값이 올바르지 않습니다."
        );
        problem.setProperty("errors", errors);
        return ResponseEntity.badRequest().body(problem);
    }

    @ExceptionHandler({
            ConstraintViolationException.class,
            MethodArgumentTypeMismatchException.class,
            HttpMessageNotReadableException.class,
            MissingServletRequestParameterException.class,
            IllegalArgumentException.class
    })
    public ResponseEntity<ProblemDetail> handleBadRequest(Exception exception) {
        return response(HttpStatus.BAD_REQUEST, "잘못된 요청", exception.getMessage());
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ProblemDetail> handleNotFound(NoSuchElementException exception) {
        return response(HttpStatus.NOT_FOUND, "리소스를 찾을 수 없음", exception.getMessage());
    }

    @ExceptionHandler(BusinessConflictException.class)
    public ResponseEntity<ProblemDetail> handleConflict(BusinessConflictException exception) {
        return response(HttpStatus.CONFLICT, "요청 상태 충돌", exception.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ProblemDetail> handleDataIntegrity(DataIntegrityViolationException exception) {
        return response(HttpStatus.CONFLICT, "데이터 상태 충돌", "참조 중이거나 이미 존재하는 데이터입니다.");
    }

    @ExceptionHandler(ErrorResponseException.class)
    public ResponseEntity<ProblemDetail> handleErrorResponse(ErrorResponseException exception) {
        HttpStatus status = HttpStatus.resolve(exception.getStatusCode().value());
        HttpStatus effectiveStatus = status == null ? HttpStatus.INTERNAL_SERVER_ERROR : status;
        String title = switch (effectiveStatus) {
            case UNAUTHORIZED -> "인증 실패";
            case FORBIDDEN -> "접근 거부";
            case NOT_FOUND -> "리소스를 찾을 수 없음";
            default -> "요청 처리 실패";
        };
        String detail = exception.getBody().getDetail();
        return response(effectiveStatus, title, detail);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleUnexpected(Exception exception) {
        log.error("처리되지 않은 서버 오류", exception);
        return response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "서버 내부 오류",
                "요청을 처리하는 중 내부 오류가 발생했습니다."
        );
    }

    private ResponseEntity<ProblemDetail> response(HttpStatus status, String title, String detail) {
        return ResponseEntity.status(status).body(problem(status, title, detail));
    }

    private ProblemDetail problem(HttpStatus status, String title, String detail) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, safeDetail(detail));
        problem.setTitle(title);
        return problem;
    }

    private String safeDetail(String detail) {
        return detail == null || detail.isBlank() ? "요청을 처리할 수 없습니다." : detail;
    }
}
