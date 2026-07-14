import { useRef, useState } from 'react';
import {
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiBox,
  FiCalendar,
  FiHash,
  FiInfo,
  FiUser,
  FiX,
} from 'react-icons/fi';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FormGrid,
  HelperText,
  ModalActions,
  ModalBody,
  ModalCloseButton,
  ModalDescription,
  ModalHeader,
  ModalOverlay,
  ModalPanel,
  ModalTitle,
  MovementTypeContent,
  MovementTypeGrid,
  MovementTypeOption,
  Notice,
  PrimaryButton,
  RequiredMark,
  SecondaryButton,
  Section,
  SectionDescription,
  SectionHeader,
  SectionIcon,
  SectionTitle,
  Select,
  StepBadge,
  StepConnector,
  StepContent,
  StepItem,
  StepLabel,
  StepPanel,
  StepProgress,
  StepViewport,
  TextArea,
  TextInput,
} from './StockMovementRegistrationCss';

const steps = ['입출고 구분', '품목 및 LOT', '처리 정보'];

function StockMovementRegistration({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState('forward');
  const modalBodyRef = useRef(null);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setCurrentStep(0);
    setSlideDirection('forward');
    onClose();
  };

  const handleNext = () => {
    modalBodyRef.current?.scrollTo({ top: 0 });
    setSlideDirection('forward');
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    modalBodyRef.current?.scrollTo({ top: 0 });
    setSlideDirection('backward');
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalPanel
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-movement-title"
        onClick={(event) => event.stopPropagation()}
      >
        <ModalHeader>
          <div>
            <ModalTitle id="stock-movement-title">입출고 등록</ModalTitle>
            <ModalDescription>
              자재 또는 완제품의 입고·출고 정보를 입력합니다.
            </ModalDescription>
          </div>
          <ModalCloseButton
            type="button"
            aria-label="입출고 등록 창 닫기"
            onClick={handleClose}
          >
            <FiX aria-hidden="true" />
          </ModalCloseButton>
        </ModalHeader>

        <StepProgress aria-label="입출고 등록 진행 단계">
          {steps.map((step, index) => (
            <StepItem
              key={step}
              $active={currentStep === index}
              $complete={currentStep > index}
              aria-current={currentStep === index ? 'step' : undefined}
            >
              <StepBadge $active={currentStep === index} $complete={currentStep > index}>
                {index + 1}
              </StepBadge>
              <StepLabel>{step}</StepLabel>
              {index < steps.length - 1 && (
                <StepConnector $complete={currentStep > index} aria-hidden="true" />
              )}
            </StepItem>
          ))}
        </StepProgress>

        <ModalBody ref={modalBodyRef}>
          <StepViewport>
            <StepContent>
              <StepPanel $active={currentStep === 0} $direction={slideDirection}>
                <Section>
                  <SectionHeader>
                    <SectionIcon>
                      <FiArrowDownCircle aria-hidden="true" />
                    </SectionIcon>
                    <div>
                      <SectionTitle>입출고 구분</SectionTitle>
                      <SectionDescription>처리할 재고 이동 유형을 선택하세요.</SectionDescription>
                    </div>
                  </SectionHeader>
                  <MovementTypeGrid>
                    <MovementTypeOption>
                      <input type="radio" name="movement-type" value="입고" defaultChecked />
                      <MovementTypeContent $tone="inbound">
                        <FiArrowDownCircle aria-hidden="true" />
                        <span>
                          <strong>입고</strong>
                          <small>구매 입고 또는 생산 완료 수량</small>
                        </span>
                      </MovementTypeContent>
                    </MovementTypeOption>
                    <MovementTypeOption>
                      <input type="radio" name="movement-type" value="출고" />
                      <MovementTypeContent $tone="outbound">
                        <FiArrowUpCircle aria-hidden="true" />
                        <span>
                          <strong>출고</strong>
                          <small>생산 투입 또는 제품 출하 수량</small>
                        </span>
                      </MovementTypeContent>
                    </MovementTypeOption>
                  </MovementTypeGrid>
                </Section>
              </StepPanel>

              <StepPanel $active={currentStep === 1} $direction={slideDirection}>
                <Section>
                  <SectionHeader>
                    <SectionIcon>
                      <FiBox aria-hidden="true" />
                    </SectionIcon>
                    <div>
                      <SectionTitle>품목 및 LOT 정보</SectionTitle>
                      <SectionDescription>재고 이동 대상과 수량 기준을 입력합니다.</SectionDescription>
                    </div>
                  </SectionHeader>
                  <FormGrid>
                    <Field>
                      <FieldLabel htmlFor="movement-item-type">
                        품목 구분 <RequiredMark>*</RequiredMark>
                      </FieldLabel>
                      <Select id="movement-item-type" defaultValue="자재">
                        <option>자재</option>
                        <option>완제품</option>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="movement-item">
                        대상 품목 <RequiredMark>*</RequiredMark>
                      </FieldLabel>
                      <Select id="movement-item" defaultValue="">
                        <option value="" disabled>품목을 선택하세요</option>
                        <option>면 블록</option>
                        <option>분말 스프</option>
                        <option>컵 용기</option>
                        <option>매운 컵라면 110g</option>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="movement-lot">
                        LOT 번호 <RequiredMark>*</RequiredMark>
                      </FieldLabel>
                      <FieldGroup>
                        <FiHash aria-hidden="true" />
                        <TextInput id="movement-lot" placeholder="예: MAT-L-9204" />
                      </FieldGroup>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="movement-order">작업지시 번호</FieldLabel>
                      <TextInput id="movement-order" placeholder="예: WO-2407-021" />
                      <HelperText>생산 투입 또는 생산 완료 건인 경우 입력합니다.</HelperText>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="movement-quantity">
                        수량 <RequiredMark>*</RequiredMark>
                      </FieldLabel>
                      <TextInput id="movement-quantity" inputMode="decimal" placeholder="0" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="movement-unit">단위</FieldLabel>
                      <Select id="movement-unit" defaultValue="EA">
                        <option>EA</option>
                        <option>g</option>
                        <option>kg</option>
                        <option>ml</option>
                        <option>BOX</option>
                      </Select>
                    </Field>
                  </FormGrid>
                </Section>
              </StepPanel>

              <StepPanel $active={currentStep === 2} $direction={slideDirection}>
                  <Section>
                    <SectionHeader>
                      <SectionIcon>
                        <FiCalendar aria-hidden="true" />
                      </SectionIcon>
                      <div>
                        <SectionTitle>처리 정보</SectionTitle>
                        <SectionDescription>처리 시점과 재고 보관 위치를 입력합니다.</SectionDescription>
                      </div>
                    </SectionHeader>
                    <FormGrid>
                      <Field>
                        <FieldLabel htmlFor="movement-date">
                          처리 일자 <RequiredMark>*</RequiredMark>
                        </FieldLabel>
                        <TextInput id="movement-date" type="date" defaultValue="2026-07-13" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="movement-time">처리 시간</FieldLabel>
                        <TextInput id="movement-time" type="time" defaultValue="09:00" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="movement-location">
                          보관 위치 <RequiredMark>*</RequiredMark>
                        </FieldLabel>
                        <Select id="movement-location" defaultValue="">
                          <option value="" disabled>보관 위치를 선택하세요</option>
                          <option>원자재 창고 A</option>
                          <option>원자재 창고 B</option>
                          <option>생산 대기 구역</option>
                          <option>완제품 창고</option>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="movement-owner">담당자</FieldLabel>
                        <FieldGroup>
                          <FiUser aria-hidden="true" />
                          <TextInput id="movement-owner" defaultValue="김민준" />
                        </FieldGroup>
                      </Field>
                      <Field $wide>
                        <FieldLabel htmlFor="movement-note">비고</FieldLabel>
                        <TextArea
                          id="movement-note"
                          placeholder="입출고 사유 또는 확인 사항을 입력하세요."
                        />
                      </Field>
                    </FormGrid>
                  </Section>

                  <Notice>
                    <FiInfo aria-hidden="true" />
                    <span>
                      <strong>등록 전 확인</strong>
                      입출고 유형, 대상 LOT, 수량 및 보관 위치가 실제 처리 내용과
                      일치하는지 확인하세요.
                    </span>
                  </Notice>
              </StepPanel>
            </StepContent>
          </StepViewport>
        </ModalBody>

        <ModalActions>
          <SecondaryButton
            type="button"
            onClick={currentStep === 0 ? handleClose : handlePrevious}
          >
            {currentStep === 0 ? '취소' : '이전'}
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={currentStep < steps.length - 1 ? handleNext : undefined}
          >
            {currentStep < steps.length - 1 ? '다음' : '등록'}
          </PrimaryButton>
        </ModalActions>
      </ModalPanel>
    </ModalOverlay>
  );
}

export default StockMovementRegistration;
