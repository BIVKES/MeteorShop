<template>
  <div class="modal-backdrop" @click.self="closeModal">
    <div class="modal-card">
      <button class="modal-card__close" @click="closeModal">✕</button>

      <h2 class="modal-card__title">Типа оплата</h2>
      <p class="modal-card__subtitle">
        Заказ сотрудника: <strong>{{ userName }}</strong>
      </p>

      <div class="modal-card__amount">
        <span>Сумма к оплате:</span>
        <strong class="modal-card__price">{{ totalAmount }} ₽</strong>
      </div>

      <div class="payment-methods">
        <button 
          :class="method === 'sbp' ? 'payment-methods__btn payment-methods__btn--active' : 'payment-methods__btn'"
          @click="selectMethod('sbp')"
        >
          📱 СБП (QR-код)
        </button>
        <button 
          :class="method === 'card' ? 'payment-methods__btn payment-methods__btn--active' : 'payment-methods__btn'"
          @click="selectMethod('card')"
        >
          💳 Карта
        </button>
      </div>

      <div v-if="method === 'sbp'" class="modal-card__qr-box">
        <div class="qr-placeholder">
          <span class="qr-placeholder__code">QR CODE</span>
        </div>
        <p class="modal-card__hint">Отсканируйте код в приложении банка</p>
      </div>

      <div v-if="method === 'card'" class="modal-card__card-box">
        <input 
          v-model="cardNumber"
          class="modal-input" 
          placeholder="0000 0000 0000 0000" 
          maxlength="19"
          @input="formatCardNumber"
        />
        <div class="modal-input-group">
          <input 
            v-model="cardExpiry"
            class="modal-input" 
            placeholder="MM/YY" 
            maxlength="5"
            @input="formatCardExpiry"
          />
          <input 
            v-model="cardCvc"
            type="password"
            class="modal-input" 
            placeholder="CVC" 
            maxlength="3"
          />
        </div>
      </div>

      <button 
        class="btn-pay" 
        :disabled="isProcessing || !isFormValid"
        @click="handlePay"
      >
        <span v-if="!isProcessing">Подтвердить оплату {{ totalAmount }} ₽</span>
        <span v-else>Обработка...</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import './styles/PaymentModal.css';

import { ref, computed } from 'vue';

defineProps({
  userName: { type: String, required: true },
  totalAmount: { type: Number, required: true }
});

const emit = defineEmits(['close', 'confirm']);

const method = ref('card');
const isProcessing = ref(false);

const cardNumber = ref('');
const cardExpiry = ref('');
const cardCvc = ref('');

const closeModal = () => {
  emit('close');
};

const selectMethod = (type) => {
  method.value = type;
};

const isFormValid = computed(() => {
  if (method.value === 'sbp') return true;

  return (
    method.value === 'card' &&
    cardNumber.value.length === 19 &&
    cardExpiry.value.length === 5 &&
    cardCvc.value.length === 3
  );
});

function formatCardNumber(event) {
  let value = event.target.value.replace(/\D/g, '').slice(0, 16);
  const parts = value.match(/.{1,4}/g);
  cardNumber.value = parts ? parts.join(' ') : value;
}

function formatCardExpiry(event) {
  let value = event.target.value.replace(/\D/g, '').slice(0, 4);
  if (value.length >= 3) {
    cardExpiry.value = value.slice(0, 2) + '/' + value.slice(2);
  } else {
    cardExpiry.value = value;
  }
}

function handlePay() {
  if (!isFormValid.value) return;
  
  isProcessing.value = true;
  setTimeout(() => {
    isProcessing.value = false;
    emit('confirm');
  }, 1000);
}
</script>