<template>
  <div class="food-app">
    <div class="food-app__header">
      <div class="food-app__brand">
        <h1 class="food-app__title">Office Food Squad</h1>
        <p class="food-app__subtitle">Совместный заказ еды в реальном времени</p>
      </div>

      <div :class="isUserError ? 'user-selector user-selector--error' : 'user-selector'">
        <label for="username" class="user-selector__label">Кто делает заказ:</label>
        <input 
          id="username"
          ref="userInputRef"
          v-model="currentUser" 
          placeholder="Введите ваше имя..." 
          class="user-selector__input"
          @input="clearError"
        />
      </div>
    </div>

    <div class="delivery-bar">
      <div class="delivery-bar__info">
        <span>До бесплатной доставки: <strong>{{ remainingForFreeDelivery }} ₽</strong></span>
        <span><strong>{{ totalPrice }}</strong> / {{ freeDeliveryTarget }} ₽</span>
      </div>
      <div class="delivery-bar__track">
        <div class="delivery-bar__fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </div>

    <div class="food-app__main">
      <FoodCatalog 
        :menu="menu" 
        :cart-items="cartItems"
        :current-user="currentUser"
        @add-to-cart="addToCart" 
        @remove-from-cart="removeOneFromCart"
      />

      <div class="group-cart">
        <div class="group-cart__header">
          <h2 class="group-cart__title">Общий заказ ({{ cartItems.length }})</h2>
          <button v-if="cartItems.length > 0" @click="clearCart" class="btn-text-danger">
            Очистить
          </button>
        </div>

        <div v-if="cartItems.length === 0" class="group-cart__empty">
          Корзина пуста. Выберите блюдо из меню слева!
        </div>

        <ul v-else class="group-cart__list">
          <li 
            v-for="group in groupedCartItems" 
            :key="group.key" 
            :class="group.isPaid ? 'cart-item cart-item--paid' : 'cart-item'"
          >
            <div class="cart-item__top">
              <span class="cart-item__user">👤 {{ group.userName }}</span>
              <button :class="group.isPaid ? 'badge badge--success' : 'badge badge--warning'">
                <span v-if="group.isPaid">Оплачено</span>
                <span v-else>Ждет оплаты</span>
              </button>
            </div>

            <div class="cart-item__bottom">
              <span class="cart-item__name" :title="group.name">
                {{ group.name }} 
                <strong v-if="group.count > 1" class="cart-item__count">x{{ group.count }}</strong>
              </span>
              <div class="cart-item__actions">
                <span class="cart-item__price">{{ group.totalPrice }} ₽</span>
                <button @click="removeGroup(group.ids)" class="cart-item__remove">✕</button>
              </div>
            </div>
          </li>
        </ul>

        <div class="group-cart__total">
          <span>Итого к оплате:</span>
          <strong class="group-cart__total-price">{{ totalPrice }} ₽</strong>
        </div>

        <button 
          v-if="myUnpaidItems.length > 0"
          class="btn btn--primary btn--full"
          style="margin-top: 16px;"
          @click="openModal"
        >
          Оплатить мой заказ ({{ myUnpaidTotal }} ₽)
        </button>
      </div>
    </div>

    <PaymentModal
      v-if="isModalOpen"
      :user-name="currentUser"
      :total-amount="myUnpaidTotal"
      @close="closeModal"
      @confirm="confirmPayment"
    />
  </div>
</template>

<script setup>
import './components/styles/App.css';

import { ref, computed, onUnmounted } from 'vue';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { MenuCollection, OfficeCartCollection } from '/imports/api/collections';
import PaymentModal from './components/PaymentModal.vue';
import FoodCatalog from './components/FoodCatalog.vue';

const currentUser = ref('');
const isUserError = ref(false);
const userInputRef = ref(null);

const freeDeliveryTarget = 2500;
const isModalOpen = ref(false);

const menu = ref([]);
const cartItems = ref([]);

const clearError = () => {
  isUserError.value = false;
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const totalPrice = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price, 0)
);

const groupedCartItems = computed(() => {
  const map = new Map();

  for (const item of cartItems.value) {
    const key = `${item.userName}_${item.menuItemId}_${item.isPaid}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        userName: item.userName,
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        totalPrice: item.price,
        isPaid: item.isPaid,
        count: 1,
        ids: [item._id]
      });
    } else {
      const group = map.get(key);
      group.count += 1;
      group.totalPrice += item.price;
      group.ids.push(item._id);
    }
  }

  return Array.from(map.values());
});

const remainingForFreeDelivery = computed(() =>
  Math.max(0, freeDeliveryTarget - totalPrice.value)
);

const progressPercent = computed(() => {
  if (!freeDeliveryTarget) return 0;
  return Math.min(100, (totalPrice.value / freeDeliveryTarget) * 100);
});

const myUnpaidItems = computed(() => {
  const user = currentUser.value.trim();
  if (!user) return [];
  return cartItems.value.filter(
    item => item.userName === user && !item.isPaid
  );
});

const myUnpaidTotal = computed(() =>
  myUnpaidItems.value.reduce((sum, item) => sum + item.price, 0)
);

const computation = Tracker.autorun(() => {
  Meteor.subscribe('officeFoodData');
  menu.value = MenuCollection.find().fetch();
  cartItems.value = OfficeCartCollection.find({}, { sort: { createdAt: -1 } }).fetch();
});

onUnmounted(() => {
  computation.stop();
});

async function confirmPayment() {
  try {
    for (const item of myUnpaidItems.value) {
      await Meteor.callAsync('cart.markPaid', item._id);
    }

    isModalOpen.value = false;
  } catch (err) {
    console.error('Ошибка при проведении оплаты:', err);
    alert(err?.reason || 'Ошибка при проведении оплаты');
  }
}

async function addToCart(menuItemId) {
  const user = currentUser.value.trim();

  if (!user) {
    isUserError.value = true;
    if (userInputRef.value) {
      userInputRef.value.focus();
    }
    return;
  }

  try {
    await Meteor.callAsync('cart.addItem', { 
      menuItemId, 
      userName: user 
    });
  } catch (err) {
    alert('Ошибка добавления');
  }
}

async function removeOneFromCart(menuItemId) {
  const user = currentUser.value.trim();
  if (!user) return;

  const item = cartItems.value.find(
    it => it.menuItemId === menuItemId && it.userName === user
  );

  if (!item) return;

  await Meteor.callAsync('cart.removeItem', item._id);
}

async function removeGroup(ids) {
  await Promise.all(
    ids.map(id => Meteor.callAsync('cart.removeItem', id))
  );
}

async function clearCart() {
  const isSure = confirm('Очистить весь общий заказ?');
  if (isSure) {
    await Meteor.callAsync('cart.clear');
  }
}
</script>
