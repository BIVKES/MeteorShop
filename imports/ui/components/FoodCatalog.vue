<template>
  <div class="food-catalog">
    <div class="catalog-header">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Поиск блюд..." 
          class="search-input"
          @input="resetPage"
        />
      </div>
    </div>

    <div class="categories-nav">
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="cat.id === activeCategory ? 'category-btn active' : 'category-btn'"
        @click="selectCategory(cat.id)"
      >
        <span>{{ cat.image }}</span>
        <span>{{ cat.label }}</span>
      </button>
    </div>

    <div class="products-grid">
      <div 
        v-for="item in paginatedMenu" 
        :key="item._id" 
        class="product-card"
      >
        <div class="product-image-container">
          <img :src="item.image" :alt="item.name" class="product-image" />
        </div>

        <div class="product-info">
          <span class="product-category">{{ getCategoryLabel(item.category) }}</span>
          <h3 class="product-title">{{ item.name }}</h3>
          <p class="product-description">{{ item.description }}</p>

          <div class="product-footer">
            <span class="product-price">{{ item.price }} ₽</span>

            <button
              v-if="getItemCount(item._id) === 0" 
              class="add-to-cart-btn" 
              @click="addItem(item._id)"
            >
              В корзину
            </button>

            <div v-else class="cart-stepper">
              <button class="stepper-btn" @click="decreaseItem(item._id)">−</button>
              <span class="stepper-count">{{ getItemCount(item._id) }}</span>
              <button class="stepper-btn" @click="addItem(item._id)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredMenu.length === 0" class="empty-state">
      Ничего не найдено 😔
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        ←
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        :class="currentPage === page ? 'page-btn active' : 'page-btn'"
        @click="setPage(page)"
      >
        {{ page }}
      </button>

      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        →
      </button>
    </div>
  </div>
</template>

<script setup>
import './styles/FoodCatalog.css';
import { ref, computed } from 'vue';
import { MENU_CATEGORIES } from '/imports/api/fixtures/menuData';

const props = defineProps({
  menu: {
    type: Array,
    default: () => []
  },
  cartItems: {
    type: Array,
    default: () => []
  },
  currentUser: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['add-to-cart', 'remove-from-cart']);

const searchQuery = ref('');
const activeCategory = ref('all');
const categories = MENU_CATEGORIES;

const currentPage = ref(1);
const itemsPerPage = 6;

const resetPage = () => {
  currentPage.value = 1;
};

const selectCategory = (catId) => {
  activeCategory.value = catId;
  resetPage();
};

const setPage = (pageNumber) => {
  currentPage.value = pageNumber;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const addItem = (itemId) => {
  emit('add-to-cart', itemId);
};

const decreaseItem = (itemId) => {
  emit('remove-from-cart', itemId);
};

const getItemCount = (menuItemId) => {
  if (!props.currentUser) return 0;

  return props.cartItems.reduce((acc, item) => {
    if (item.menuItemId === menuItemId && item.userName === props.currentUser) {
      return acc + 1;
    }
    return acc;
  }, 0);
};

const getCategoryLabel = (catId) => {
  const cat = categories.find(
    c => c.id.toLowerCase() === String(catId).toLowerCase()
  );
  return cat ? cat.label : catId;
};

const filteredMenu = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const active = activeCategory.value.toLowerCase();

  return props.menu.filter(item => {
    const itemCat = String(item.category || '').toLowerCase();
    const isCategoryMatch = active === 'all' || itemCat === active;
    const isSearchMatch = item.name.toLowerCase().includes(query);
    return isCategoryMatch && isSearchMatch;
  });
});

const totalPages = computed(() => 
  Math.max(1, Math.ceil(filteredMenu.value.length / itemsPerPage))
);

const paginatedMenu = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredMenu.value.slice(start, start + itemsPerPage);
});
</script>