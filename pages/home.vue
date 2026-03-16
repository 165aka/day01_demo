<template>
  <div class="campus-market">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <span class="logo-icon">🎓</span>
          <span class="logo-text">校园二手市场</span>
        </div>

        <div class="search-box">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="搜索教材、数码、生活用品..."
            class="search-input"
          />
          <button @click="handleSearch" class="search-btn">
            <span>🔍</span>
          </button>
        </div>

        <div class="nav-actions">
          <button class="nav-btn" @click="showPublishModal = true">
            <span class="icon">+</span>
            <span>发布闲置</span>
          </button>
          <div class="user-menu">
            <div class="avatar" @click="toggleUserMenu">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="用户头像"
              />
            </div>
            <div v-if="showUserMenu" class="dropdown-menu">
              <a href="#" @click.prevent="goToProfile" class="dropdown-item">
                👤 个人中心
              </a>
              <a
                href="#"
                @click.prevent="goToMyPublished"
                class="dropdown-item"
              >
                📦 我的发布
              </a>
              <a
                href="#"
                @click.prevent="goToMyFavorites"
                class="dropdown-item"
              >
                ⭐ 我的收藏
              </a>
              <a href="#" @click.prevent="goToMessages" class="dropdown-item">
                💬 消息中心
              </a>
              <div class="divider"></div>
              <a href="#" @click.prevent="handleLogout" class="dropdown-item">
                🚪 退出登录
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 分类筛选栏 -->
      <section class="category-section">
        <div class="category-container">
          <div class="category-list">
            <button
              v-for="cat in categories"
              :key="cat.id"
              @click="selectCategory(cat.id)"
              :class="[
                'category-item',
                { active: selectedCategory === cat.id },
              ]"
            >
              <span class="cat-icon">{{ cat.icon }}</span>
              <span class="cat-name">{{ cat.name }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 筛选排序栏 -->
      <section class="filter-bar">
        <div class="filter-container">
          <div class="filter-options">
            <button
              v-for="filter in filters"
              :key="filter.value"
              @click="selectFilter(filter.value)"
              :class="[
                'filter-btn',
                { active: selectedFilter === filter.value },
              ]"
            >
              {{ filter.label }}
            </button>
          </div>
          <div class="campus-selector">
            <select v-model="selectedCampus" class="campus-select">
              <option value="">全部校区</option>
              <option v-for="campus in campuses" :key="campus" :value="campus">
                {{ campus }}
              </option>
            </select>
          </div>
        </div>
      </section>

      <!-- 商品网格 -->
      <section class="products-section">
        <div class="products-container">
          <div v-if="filteredProducts.length === 0" class="empty-state">
            <div class="empty-icon">📦</div>
            <p>暂无相关商品，换个关键词试试？</p>
          </div>

          <div v-else class="products-grid">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-card"
              @click="viewProduct(product)"
            >
              <div class="product-image">
                <img :src="product.image" :alt="product.title" loading="lazy" />
                <div v-if="product.isNew" class="badge new">全新</div>
                <div v-if="product.isUrgent" class="badge urgent">急出</div>
                <button
                  @click.stop="toggleFavorite(product)"
                  class="favorite-btn"
                  :class="{ active: product.isFavorite }"
                >
                  <span>{{ product.isFavorite ? "❤️" : "🤍" }}</span>
                </button>
              </div>

              <div class="product-info">
                <h3 class="product-title">{{ product.title }}</h3>
                <div class="product-meta">
                  <span class="price">¥{{ product.price }}</span>
                  <span v-if="product.originalPrice" class="original-price">
                    ¥{{ product.originalPrice }}
                  </span>
                </div>
                <div class="product-tags">
                  <span v-for="tag in product.tags" :key="tag" class="tag">{{
                    tag
                  }}</span>
                </div>
                <div class="product-footer">
                  <div class="seller">
                    <img :src="product.sellerAvatar" class="seller-avatar" />
                    <span class="seller-name">{{ product.sellerName }}</span>
                  </div>
                  <span class="location">📍 {{ product.location }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载更多 -->
          <div v-if="filteredProducts.length > 0" class="load-more">
            <button @click="loadMore" class="load-more-btn" :disabled="loading">
              {{ loading ? "加载中..." : "加载更多" }}
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- 发布商品弹窗 -->
    <div
      v-if="showPublishModal"
      class="modal-overlay"
      @click.self="showPublishModal = false"
    >
      <div class="modal-content publish-modal">
        <div class="modal-header">
          <h2>发布闲置物品</h2>
          <button @click="showPublishModal = false" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="publishProduct">
            <div class="form-group">
              <label>物品名称</label>
              <input
                v-model="newProduct.title"
                type="text"
                placeholder="例如：高等数学教材"
                required
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>价格 (元)</label>
                <input
                  v-model="newProduct.price"
                  type="number"
                  placeholder="0.00"
                  required
                />
              </div>
              <div class="form-group">
                <label>原价 (选填)</label>
                <input
                  v-model="newProduct.originalPrice"
                  type="number"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div class="form-group">
              <label>分类</label>
              <select v-model="newProduct.category" required>
                <option
                  v-for="cat in categories.slice(1)"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>物品描述</label>
              <textarea
                v-model="newProduct.description"
                rows="4"
                placeholder="描述一下物品的使用情况、成色等..."
              ></textarea>
            </div>
            <div class="form-group">
              <label>上传图片</label>
              <div class="upload-area">
                <div class="upload-placeholder">
                  <span class="upload-icon">📷</span>
                  <span>点击或拖拽上传图片</span>
                </div>
              </div>
            </div>
            <button type="submit" class="submit-btn">立即发布</button>
          </form>
        </div>
      </div>
    </div>

    <!-- 商品详情弹窗 -->
    <div
      v-if="selectedProduct"
      class="modal-overlay"
      @click.self="selectedProduct = null"
    >
      <div class="modal-content product-detail-modal">
        <button @click="selectedProduct = null" class="close-btn">×</button>
        <div class="detail-layout">
          <div class="detail-images">
            <img :src="selectedProduct.image" :alt="selectedProduct.title" />
          </div>
          <div class="detail-info">
            <h2>{{ selectedProduct.title }}</h2>
            <div class="detail-price">
              <span class="current-price">¥{{ selectedProduct.price }}</span>
              <span v-if="selectedProduct.originalPrice" class="original-price">
                原价 ¥{{ selectedProduct.originalPrice }}
              </span>
            </div>
            <div class="detail-seller">
              <img :src="selectedProduct.sellerAvatar" />
              <div class="seller-info">
                <span class="name">{{ selectedProduct.sellerName }}</span>
                <span class="credit">信用极好</span>
              </div>
              <button class="contact-btn">联系卖家</button>
            </div>
            <div class="detail-desc">
              <h4>物品描述</h4>
              <p>{{ selectedProduct.description || "暂无描述" }}</p>
            </div>
            <div class="detail-actions">
              <button class="buy-btn">我想要</button>
              <button class="fav-btn" @click="toggleFavorite(selectedProduct)">
                {{ selectedProduct.isFavorite ? "已收藏" : "收藏" }}
              </button>
            </div>
            <div class="detail-actions">
              <button @click="openWantModal(selectedProduct)" class="buy-btn">
                我想要
              </button>
              <button class="fav-btn" @click="toggleFavorite(selectedProduct)">
                {{ selectedProduct.isFavorite ? "已收藏" : "收藏" }}
              </button>
            </div>

            <!-- 我想要弹窗 -->
            <div
              v-if="showWantModal"
              class="modal-overlay"
              @click.self="showWantModal = false"
            >
              <div class="modal-content want-modal">
                <div class="modal-header">
                  <h2>🙋 我想要</h2>
                  <button @click="showWantModal = false" class="close-btn">
                    ×
                  </button>
                </div>
                <div class="modal-body">
                  <div class="product-info-summary">
                    <img :src="wantForm.product.image" alt="" />
                    <div class="info">
                      <h4>{{ wantForm.product.title }}</h4>
                      <span class="price">¥{{ wantForm.product.price }}</span>
                    </div>
                  </div>

                  <form @submit.prevent="submitWant">
                    <div class="form-group">
                      <label class="form-label">
                        💰 你的心理预期价格
                        <span class="hint">（卖家可以看到）</span>
                      </label>
                      <input
                        v-model.number="wantForm.expectedPrice"
                        type="number"
                        placeholder="输入你的出价"
                        required
                        class="form-input"
                      />
                      <div v-if="wantForm.expectedPrice" class="price-diff">
                        <span
                          v-if="wantForm.expectedPrice < wantForm.product.price"
                          class="diff-negative"
                        >
                          比标价低 ¥{{
                            (
                              wantForm.product.price - wantForm.expectedPrice
                            ).toFixed(2)
                          }}
                        </span>
                        <span
                          v-else-if="
                            wantForm.expectedPrice > wantForm.product.price
                          "
                          class="diff-positive"
                        >
                          比标价高 ¥{{
                            (
                              wantForm.expectedPrice - wantForm.product.price
                            ).toFixed(2)
                          }}
                        </span>
                        <span v-else class="diff-equal"> 与标价相同 </span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">
                        🔄 用我的物品交换
                        <span class="hint">（可选，补齐差价）</span>
                      </label>
                      <div class="exchange-selector">
                        <select
                          v-model="wantForm.exchangeProductId"
                          class="exchange-select"
                        >
                          <option value="">不使用物品交换</option>
                          <option
                            v-for="item in myPublishedItems"
                            :key="item.id"
                            :value="item.id"
                          >
                            {{ item.title }} - ¥{{ item.price }}
                          </option>
                        </select>
                      </div>
                      <div
                        v-if="wantForm.exchangeProductId"
                        class="exchange-info"
                      >
                        <div class="exchange-item">
                          <img :src="selectedExchangeItem?.image" alt="" />
                          <div class="details">
                            <span class="name">{{
                              selectedExchangeItem?.title
                            }}</span>
                            <span class="value"
                              >价值 ¥{{ selectedExchangeItem?.price }}</span
                            >
                          </div>
                        </div>
                        <div v-if="selectedExchangeItem" class="exchange-calc">
                          <div class="calc-row">
                            <span>对方物品：</span>
                            <span class="amount"
                              >¥{{ wantForm.product.price }}</span
                            >
                          </div>
                          <div class="calc-row">
                            <span>你的物品：</span>
                            <span class="amount"
                              >-¥{{ selectedExchangeItem.price }}</span
                            >
                          </div>
                          <div class="calc-row total">
                            <span>需补差价：</span>
                            <span
                              :class="[
                                'amount',
                                exchangeNeedPay >= 0 ? 'pay' : 'get',
                              ]"
                            >
                              {{
                                exchangeNeedPay >= 0 ? "你需要支付" : "你将获得"
                              }}
                              ¥{{ Math.abs(exchangeNeedPay).toFixed(2) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">📝 留言给卖家</label>
                      <textarea
                        v-model="wantForm.message"
                        rows="3"
                        placeholder="说说你的情况，比如：诚心想要、可小刀等..."
                        class="form-textarea"
                      ></textarea>
                    </div>

                    <button type="submit" class="submit-btn">发送给卖家</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>关于我们</h4>
          <p>校园二手交易平台，让闲置物品流转起来</p>
        </div>
        <div class="footer-section">
          <h4>安全提示</h4>
          <p>交易请认准校内认证用户，谨防诈骗</p>
        </div>
        <div class="footer-section">
          <h4>联系我们</h4>
          <p>邮箱：support@campus.market</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 校园二手市场 - 让校园生活更美好</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// 状态管理
const searchQuery = ref("");
const selectedCategory = ref("all");
const selectedFilter = ref("newest");
const selectedCampus = ref("");
const showUserMenu = ref(false);
const showPublishModal = ref(false);
const selectedProduct = ref(null);
const loading = ref(false);
const showWantModal = ref(false);

// 数据
const categories = [
  { id: "all", name: "全部", icon: "🏠" },
  { id: "books", name: "教材书籍", icon: "📚" },
  { id: "digital", name: "数码电子", icon: "💻" },
  { id: "life", name: "生活用品", icon: "🏠" },
  { id: "sports", name: "体育器材", icon: "⚽" },
  { id: "clothes", name: "衣物鞋帽", icon: "👕" },
  { id: "transport", name: "交通工具", icon: "🚲" },
  { id: "others", name: "其他", icon: "📦" },
];

const filters = [
  { label: "最新发布", value: "newest" },
  { label: "价格最低", value: "price_asc" },
  { label: "价格最高", value: "price_desc" },
  { label: "距离最近", value: "nearest" },
];

const campuses = ["本部校区", "东校区", "西校区", "南校区"];

const newProduct = ref({
  title: "",
  price: "",
  originalPrice: "",
  category: "",
  description: "",
});

// 模拟我的发布物品
const myPublishedItems = ref([
  {
    id: 1,
    title: "考研英语词汇书",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    title: "罗技 G502 鼠标",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
  },
]);

// 我想要表单
const wantForm = ref({
  product: null,
  expectedPrice: null,
  exchangeProductId: "",
  message: "",
});

// 计算属性：选中的交换物品
const selectedExchangeItem = computed(() => {
  if (!wantForm.value.exchangeProductId) return null;
  return myPublishedItems.value.find(
    (item) => item.id === wantForm.value.exchangeProductId
  );
});

// 计算属性：需要补的差价
const exchangeNeedPay = computed(() => {
  if (!wantForm.value.product || !selectedExchangeItem.value) return 0;
  return wantForm.value.product.price - selectedExchangeItem.value.price;
});

// 模拟商品数据
const products = ref([
  {
    id: 1,
    title: "高等数学同济第七版 上下册",
    price: 25,
    originalPrice: 89,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    category: "books",
    tags: ["教材", "9成新", "可小刀"],
    sellerName: "数学系学长",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    location: "图书馆",
    isNew: false,
    isUrgent: true,
    isFavorite: false,
    description: "考研用完的，笔记很详细，适合大一学弟学妹",
  },
  {
    id: 2,
    title: "iPad Air 4 64G 天蓝色",
    price: 2800,
    originalPrice: 4799,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    category: "digital",
    tags: ["数码", "保修期内", "原装"],
    sellerName: "数码达人",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    location: "科技楼",
    isNew: false,
    isUrgent: false,
    isFavorite: true,
    description: "买了Pro，这个闲置了，成色很新，带原装充电器",
  },
  {
    id: 3,
    title: "宜家台灯 护眼学习灯",
    price: 45,
    originalPrice: 129,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    category: "life",
    tags: ["生活用品", "几乎全新"],
    sellerName: "毕业学姐",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    location: "女生宿舍3号楼",
    isNew: true,
    isUrgent: false,
    isFavorite: false,
    description: "毕业带不走，便宜出，灯光很柔和",
  },
  {
    id: 4,
    title: "尤尼克斯羽毛球拍",
    price: 180,
    originalPrice: 450,
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=400&fit=crop",
    category: "sports",
    tags: ["体育", "轻微使用痕迹"],
    sellerName: "羽球少年",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    location: "体育馆",
    isNew: false,
    isUrgent: true,
    isFavorite: false,
    description: "换新款了，这个闲置，拉的是95线26磅",
  },
  {
    id: 5,
    title: "捷安特山地车 ATX777",
    price: 800,
    originalPrice: 2198,
    image:
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=400&fit=crop",
    category: "transport",
    tags: ["交通工具", "可试骑"],
    sellerName: "骑行社社长",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    location: "北门停车场",
    isNew: false,
    isUrgent: false,
    isFavorite: false,
    description: "车况良好，刹车变速都正常，送车锁和头盔",
  },
  {
    id: 6,
    title: "耐克空军一号 42码",
    price: 320,
    originalPrice: 749,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    category: "clothes",
    tags: ["鞋靴", "9成新", "正品"],
    sellerName: "潮流玩家",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6",
    location: "男生宿舍5号楼",
    isNew: false,
    isUrgent: false,
    isFavorite: false,
    description: "买大了，穿了两次，鞋盒还在",
  },
  {
    id: 7,
    title: "罗技G502鼠标",
    price: 150,
    originalPrice: 399,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    category: "digital",
    tags: ["数码", "游戏外设"],
    sellerName: "电竞选手",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7",
    location: "网吧",
    isNew: false,
    isUrgent: false,
    isFavorite: true,
    description: "升级无线版了，这个有线版闲置，功能正常",
  },
  {
    id: 8,
    title: "考研英语词汇书",
    price: 15,
    originalPrice: 45,
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop",
    category: "books",
    tags: ["教材", "笔记丰富"],
    sellerName: "上岸学长",
    sellerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8",
    location: "自习室",
    isNew: false,
    isUrgent: true,
    isFavorite: false,
    description: "考研英语一85分学长笔记，重点词汇都有标记",
  },
]);

// 计算属性：筛选后的商品
const filteredProducts = computed(() => {
  let result = products.value;

  // 分类筛选
  if (selectedCategory.value !== "all") {
    result = result.filter((p) => p.category === selectedCategory.value);
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.includes(query))
    );
  }

  // 排序
  switch (selectedFilter.value) {
    case "price_asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "newest":
    default:
      result = [...result].sort((a, b) => b.id - a.id);
  }

  return result;
});

// 方法
const handleSearch = () => {
  console.log("搜索:", searchQuery.value);
};

const selectCategory = (id) => {
  selectedCategory.value = id;
};

const selectFilter = (value) => {
  selectedFilter.value = value;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const toggleFavorite = (product) => {
  product.isFavorite = !product.isFavorite;
};

const viewProduct = (product) => {
  selectedProduct.value = product;
};

const publishProduct = () => {
  console.log("发布商品:", newProduct.value);
  showPublishModal.value = false;
  // 重置表单
  newProduct.value = {
    title: "",
    price: "",
    originalPrice: "",
    category: "",
    description: "",
  };
  alert("发布成功！");
};

const loadMore = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    // 这里可以加载更多数据
  }, 1000);
};

const goToProfile = () => {
  window.location.href = "/me";
};

const goToMyPublished = () => {
  window.location.href = "/me?tab=published";
};

const goToMyFavorites = () => {
  window.location.href = "/me?tab=favorites";
};

const goToMessages = () => {
  window.location.href = "/me?tab=messages";
};

const handleLogout = () => {
  if (confirm("确定要退出登录吗？")) {
    window.location.href = "/login";
  }
};

// 方法
const openWantModal = (product) => {
  wantForm.value = {
    product,
    expectedPrice: product.price,
    exchangeProductId: "",
    message: "",
  };
  showWantModal.value = true;
};

const submitWant = () => {
  console.log("提交想要:", {
    productId: wantForm.value.product.id,
    expectedPrice: wantForm.value.expectedPrice,
    exchangeItem: selectedExchangeItem.value,
    needPay: exchangeNeedPay.value,
    message: wantForm.value.message,
  });

  // 发送消息给卖家
  const message = {
    id: Date.now(),
    type: "want",
    sender: "我",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    content: `我对你的【${wantForm.value.product.title}】很感兴趣！${
      wantForm.value.message ? "\n留言：" + wantForm.value.message : ""
    }${
      selectedExchangeItem.value
        ? `\n想用【${selectedExchangeItem.value.title}】交换，需${
            exchangeNeedPay.value >= 0 ? "补" : "退"
          }差价¥${Math.abs(exchangeNeedPay.value).toFixed(2)}`
        : `\n心理预期价格：¥${wantForm.value.expectedPrice}`
    }`,
    time: "刚刚",
    unread: false,
  };

  console.log("发送给卖家的消息:", message);
  showWantModal.value = false;
  alert("已成功发送给卖家，等待对方回复~");
};

// 点击外部关闭下拉菜单
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".user-menu")) {
      showUserMenu.value = false;
    }
  });
});
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.campus-market {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}

/* 导航栏 */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 20px;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  cursor: pointer;
  white-space: nowrap;
}

.logo-icon {
  font-size: 32px;
}

.search-box {
  flex: 1;
  max-width: 600px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 50px 0 20px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 15px;
  transition: all 0.3s;
  background: #f8f9fa;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.search-btn {
  position: absolute;
  right: 5px;
  width: 36px;
  height: 36px;
  border: none;
  background: #667eea;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.search-btn:hover {
  transform: scale(1.1);
  background: #5a6fd6;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.nav-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.nav-btn .icon {
  font-size: 20px;
  font-weight: 300;
}

.user-menu {
  position: relative;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s;
}

.avatar:hover {
  border-color: #667eea;
  transform: scale(1.1);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 8px 0;
  min-width: 160px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: block;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: #f0f0f0;
  color: #667eea;
}

.divider {
  height: 1px;
  background: #e0e0e0;
  margin: 8px 0;
}

/* 主内容区 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* 分类区 */
.category-section {
  margin-bottom: 30px;
}

.category-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.category-list {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 5px;
  scrollbar-width: none;
}

.category-list::-webkit-scrollbar {
  display: none;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px 25px;
  border: none;
  background: transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  min-width: 80px;
}

.category-item:hover {
  background: #f0f0f0;
  transform: translateY(-3px);
}

.category-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.cat-icon {
  font-size: 28px;
}

.cat-name {
  font-size: 13px;
  font-weight: 600;
}

/* 筛选栏 */
.filter-bar {
  margin-bottom: 30px;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-options {
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 5px;
  border-radius: 25px;
}

.filter-btn {
  padding: 8px 20px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  color: #667eea;
}

.filter-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.campus-select {
  padding: 10px 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  outline: none;
  transition: all 0.3s;
}

.campus-select:focus {
  border-color: white;
  background: white;
}

/* 商品网格 */
.products-section {
  min-height: 500px;
}

.products-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #f8f9fa;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.badge.new {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.badge.urgent {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.favorite-btn:hover {
  transform: scale(1.2);
  background: white;
}

.favorite-btn.active {
  background: #ffe4e4;
}

.product-info {
  padding: 20px;
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 44px;
}

.product-meta {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #ff4757;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 15px;
}

.tag {
  padding: 4px 10px;
  background: #f0f0f0;
  color: #666;
  font-size: 12px;
  border-radius: 12px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.seller {
  display: flex;
  align-items: center;
  gap: 8px;
}

.seller-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.seller-name {
  font-size: 13px;
  color: #666;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

.load-more {
  text-align: center;
  margin-top: 40px;
}

.load-more-btn {
  padding: 15px 50px;
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  font-size: 16px;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
}

.load-more-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.product-detail-modal {
  max-width: 900px;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 25px 30px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 24px;
  color: #333;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #e0e0e0;
  color: #333;
  transform: rotate(90deg);
}

.modal-body {
  padding: 30px;
}

/* 发布表单 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #666;
}

.upload-icon {
  font-size: 40px;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

/* 商品详情 */
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 30px;
}

.detail-images {
  border-radius: 16px;
  overflow: hidden;
  background: #f8f9fa;
}

.detail-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-height: 500px;
}

.detail-info h2 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
  line-height: 1.3;
}

.detail-price {
  margin-bottom: 25px;
  display: flex;
  align-items: baseline;
  gap: 15px;
}

.detail-price .current-price {
  font-size: 36px;
  font-weight: bold;
  color: #ff4757;
}

.detail-price .original-price {
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
}

.detail-seller {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 16px;
  margin-bottom: 25px;
}

.detail-seller img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.seller-info {
  flex: 1;
}

.seller-info .name {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.seller-info .credit {
  font-size: 12px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.contact-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.contact-btn:hover {
  background: #5a6fd6;
  transform: scale(1.05);
}

.detail-desc {
  margin-bottom: 30px;
}

.detail-desc h4 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #333;
}

.detail-desc p {
  color: #666;
  line-height: 1.8;
  font-size: 15px;
}

.detail-actions {
  display: flex;
  gap: 15px;
}

.buy-btn {
  flex: 1;
  padding: 16px;
  background: linear-gradient(135deg, #ff4757 0%, #ff6348 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.buy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 71, 87, 0.4);
}

.fav-btn {
  padding: 16px 30px;
  background: #f0f0f0;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.fav-btn:hover {
  background: #ffe4e4;
  color: #ff4757;
}

/* 底部 */
.footer {
  background: rgba(0, 0, 0, 0.3);
  color: white;
  padding: 60px 20px 30px;
  margin-top: 60px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h4 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #fff;
}

.footer-section p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 14px;
}

.footer-bottom {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 968px) {
  .nav-container {
    flex-wrap: wrap;
    height: auto;
    padding: 15px 0;
    gap: 15px;
  }

  .search-box {
    order: 3;
    max-width: 100%;
    width: 100%;
  }

  .category-list {
    gap: 10px;
  }

  .category-item {
    padding: 12px 18px;
    min-width: 70px;
  }

  .cat-icon {
    font-size: 24px;
  }

  .cat-name {
    font-size: 12px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 15px;
  }

  .detail-layout {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .products-container {
    padding: 20px 15px;
  }

  .product-image {
    height: 180px;
  }

  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-options {
    overflow-x: auto;
    padding: 10px;
  }

  .campus-select {
    width: 100%;
  }
}
</style>
