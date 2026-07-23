package com.human.linecup.entity;

public class InvalidWorkOrderTransitionException extends BusinessConflictException {

    public InvalidWorkOrderTransitionException(WorkOrder.Status current, WorkOrder.Action action) {
        super("현재 상태(" + current + ")에서는 '" + action + "' 처리를 할 수 없습니다.");
    }
}
