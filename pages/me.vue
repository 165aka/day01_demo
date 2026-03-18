<template>
  <div class="profile-container">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo" @click="$router.push('/home')">
          <span class="logo-icon">🎓</span>
          <span class="logo-text">校园二手市场</span>
        </div>
        <div class="nav-actions">
          <button class="nav-btn" @click="$router.push('/home')">
            <span class="icon">🏠</span>
            <span>首页</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="profile-layout">
        <!-- 左侧菜单栏 -->
        <aside class="sidebar">
          <div class="user-card">
            <div class="avatar-wrapper">
              <img :src="userInfo.avatar" alt="头像" class="avatar" />
              <button class="edit-avatar-btn">📷</button>
            </div>
            <h2 class="username">{{ userInfo.username }}</h2>
            <p class="user-bio">
              {{ userInfo.bio || "这个人很懒，什么都没写~" }}
            </p>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-value">{{ userInfo.following }}</span>
                <span class="stat-label">关注</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-value">{{ userInfo.followers }}</span>
                <span class="stat-label">粉丝</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-value">{{ userInfo.favorites }}</span>
                <span class="stat-label">收藏</span>
              </div>
            </div>
          </div>

          <div class="menu-list">
            <button
              v-for="item in menuItems"
              :key="item.id"
              :class="['menu-item', { active: activeMenu === item.id }]"
              @click="activeMenu = item.id"
            >
              <span class="menu-icon">{{ item.icon }}</span>
              <span class="menu-text">{{ item.name }}</span>
              <span v-if="item.count" class="menu-count">{{ item.count }}</span>
              <span class="menu-arrow">›</span>
            </button>
          </div>
        </aside>

        <!-- 右侧内容区 -->
        <section class="content-area">
          <!-- 我的收藏 -->
          <div v-if="activeMenu === 'favorites'" class="content-section">
            <div class="section-header">
              <h3 class="section-title">我的收藏</h3>
              <span class="section-count">共 {{ favorites.length }} 件</span>
            </div>
            <div v-if="favorites.length === 0" class="empty-state">
              <div class="empty-icon">⭐</div>
              <p>暂无收藏</p>
            </div>
            <div v-else class="products-grid">
              <div
                v-for="item in favorites"
                :key="item.id"
                class="product-card"
              >
                <div class="product-image">
                  <img :src="item.image" :alt="item.title" />
                  <button
                    @click="removeFavorite(item.id)"
                    class="remove-fav-btn"
                  >
                    ×
                  </button>
                </div>
                <div class="product-info">
                  <h4 class="product-title">{{ item.title }}</h4>
                  <div class="product-meta">
                    <span class="price">¥{{ item.price }}</span>
                    <span v-if="item.originalPrice" class="original-price">
                      ¥{{ item.originalPrice }}
                    </span>
                  </div>
                  <div class="product-footer">
                    <span class="location">📍 {{ item.location }}</span>
                    <button class="contact-btn">联系卖家</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 我的发布 -->
          <div v-if="activeMenu === 'published'" class="content-section">
            <div class="section-header">
              <h3 class="section-title">我的发布</h3>
              <button class="add-btn" @click="showPublishModal = true">
                + 发布新物品
              </button>
            </div>
            <div v-if="published.length === 0" class="empty-state">
              <div class="empty-icon">📦</div>
              <p>暂无发布</p>
              <button class="action-btn" @click="showPublishModal = true">
                立即发布
              </button>
            </div>
            <div v-else class="products-grid">
              <div
                v-for="item in published"
                :key="item.id"
                class="product-card"
              >
                <div class="product-image">
                  <img :src="item.image" :alt="item.title" />
                  <div class="product-status" :class="item.status">
                    {{ item.status === "selling" ? "出售中" : "已售出" }}
                  </div>
                </div>
                <div class="product-info">
                  <h4 class="product-title">{{ item.title }}</h4>
                  <div class="product-meta">
                    <span class="price">¥{{ item.price }}</span>
                    <span class="view-count">👁️ {{ item.views }}</span>
                  </div>
                  <div class="product-actions">
                    <button class="edit-btn">编辑</button>
                    <button class="delete-btn">删除</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 我的消息 -->
          <div v-if="activeMenu === 'messages'" class="content-section">
            <div class="section-header">
              <h3 class="section-title">消息中心</h3>
              <button class="clear-btn" @click="clearMessages">清空消息</button>
            </div>
            <div v-if="messages.length === 0" class="empty-state">
              <div class="empty-icon">💬</div>
              <p>暂无新消息</p>
            </div>
            <div v-else class="message-list">
              <div
                v-for="msg in messages"
                :key="msg.id"
                :class="['message-item', { unread: msg.unread }]"
              >
                <div class="message-avatar">
                  <img :src="msg.avatar" alt="" />
                </div>
                <div class="message-content">
                  <div class="message-header">
                    <span class="sender-name">{{ msg.sender }}</span>
                    <span class="message-time">{{ msg.time }}</span>
                  </div>
                  <p class="message-text">{{ msg.content }}</p>
                </div>
                <button
                  v-if="msg.unread"
                  class="mark-read-btn"
                  @click="markAsRead(msg.id)"
                >
                  已读
                </button>
              </div>
            </div>
          </div>

          <!-- 账户设置 -->
          <div v-if="activeMenu === 'settings'" class="content-section">
            <div class="section-header">
              <h3 class="section-title">账户设置</h3>
            </div>
            <div class="settings-form">
              <div class="form-group">
                <label class="form-label">用户名</label>
                <input
                  v-model="userInfo.username"
                  type="text"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">个人简介</label>
                <textarea
                  v-model="userInfo.bio"
                  rows="3"
                  class="form-textarea"
                  placeholder="介绍一下自己吧~"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">手机号</label>
                <input
                  v-model="userInfo.phone"
                  type="text"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">邮箱</label>
                <input
                  v-model="userInfo.email"
                  type="email"
                  class="form-input"
                />
              </div>
              <div class="form-actions">
                <button class="save-btn" @click="saveSettings">保存修改</button>
                <button class="logout-btn" @click="handleLogout">
                  退出登录
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
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
              <label>物品分类</label>
              <select
                v-model="newProduct.category"
                class="category-select"
                required
              >
                <option value="">请选择分类</option>
                <option value="books">📚 教材书籍</option>
                <option value="digital">💻 数码电子</option>
                <option value="life">🏠 生活用品</option>
                <option value="sports">⚽ 体育器材</option>
                <option value="clothes">👕 衣物鞋帽</option>
                <option value="transport">🚲 交通工具</option>
                <option value="others">📦 其他</option>
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
            <button type="submit" class="submit-btn">立即发布</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ✅ 导入认证工具函数
import { isLoggedIn, getUserInfo } from '@/utils/auth';

export default {
  layout: "default",
  data() {
    return {
      activeMenu: "favorites",
      showPublishModal: false,
      userInfo: {
        username: "张三",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        bio: "热爱分享，诚信交易",
        phone: "138****8888",
        email: "zhangsan@example.com",
        following: 56,
        followers: 128,
        favorites: 23,
      },
      favorites: [
        {
          id: 1,
          title: "高等数学同济第七版 上下册",
          price: 25,
          originalPrice: 89,
          image:
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
          location: "图书馆",
        },
        {
          id: 2,
          title: "iPad Air 4 64G 天蓝色",
          price: 2800,
          originalPrice: 4799,
          image:
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
          location: "科技楼",
        },
      ],
      published: [],
      messages: [
        {
          id: 1,
          sender: "李四",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
          content: "你好，这个物品还在吗？",
          time: "10 分钟前",
          unread: true,
        },
        {
          id: 2,
          sender: "王五",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
          content: "可以便宜一点吗？",
          time: "1 小时前",
          unread: true,
        },
        {
          id: 3,
          sender: "系统消息",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=system",
          content: "您的商品已上架成功",
          time: "昨天",
          unread: false,
        },
      ],
      newProduct: {
        title: "",
        price: "",
        originalPrice: "",
        category: "",
        description: "",
      },
      menuItems: [
        { id: "favorites", name: "我的收藏", icon: "⭐", count: null },
        { id: "published", name: "我的发布", icon: "📦", count: null },
        { id: "messages", name: "我的消息", icon: "💬", count: 2 },
        { id: "settings", name: "账户设置", icon: "⚙️", count: null },
      ],
    };
  },
  methods: {
    loadMyPublished() {
      // 从 localStorage 获取已发布的商品
      const saved = localStorage.getItem("myPublished");
      if (saved) {
        this.published = JSON.parse(saved);
      }
    },
    removeFavorite(id) {
      this.favorites = this.favorites.filter((item) => item.id !== id);
      this.userInfo.favorites--;
    },
    markAsRead(id) {
      const msg = this.messages.find((m) => m.id === id);
      if (msg) {
        msg.unread = false;
      }
    },
    clearMessages() {
      if (confirm("确定要清空所有消息吗？")) {
        this.messages = [];
      }
    },
    saveSettings() {
      console.log("保存设置:", this.userInfo);
      alert("保存成功！");
    },
    handleLogout() {
      if (confirm("确定要退出登录吗？")) {
        this.$router.push("/login");
      }
    },
    publishProduct() {
      // 数据验证
      if (!this.newProduct.category) {
        alert("请选择商品分类");
        return;
      }

      // 调用后端 API 发布商品
      this.$publishProduct(this.newProduct)
        .then((result) => {
          if (result.success) {
            this.showPublishModal = false;
            this.newProduct = {
              title: "",
              price: "",
              originalPrice: "",
              category: "",
              description: "",
            };
            alert("发布成功！");
          } else {
            alert(result.message || "发布失败");
          }
        })
        .catch((error) => {
          console.error("发布失败:", error);
          alert("发布失败：" + error.message);
        });
    },
  },

  // me.vue 的 mounted 中
  mounted() {
    // ✅ 使用导入的函数进行登录检查
    if (!isLoggedIn()) {
      this.$router.push("/login");
      return;
    }

    const userInfo = getUserInfo();
    this.userInfo.username = userInfo?.username || this.userInfo.username;
    this.userInfo.avatar = userInfo?.avatar || this.userInfo.avatar;

    // 按用户 ID 加载数据
    const key = `myPublished_${userInfo?.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      this.published = JSON.parse(saved);
    }

    const tab = this.$route.query.tab;
    if (
      tab &&
      ["favorites", "published", "messages", "settings"].includes(tab)
    ) {
      this.activeMenu = tab;
    }
    this.loadMyPublished();
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.profile-container {
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
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  cursor: pointer;
}

.logo-icon {
  font-size: 32px;
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

/* 主内容区 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
}

.profile-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 30px;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: 2px solid #667eea;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.username {
  font-size: 24px;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 8px;
}

.user-bio {
  color: #718096;
  font-size: 14px;
  margin-bottom: 20px;
}

.user-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0 15px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 13px;
  color: #718096;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: #e2e8f0;
}

/* 菜单列表 */
.menu-list {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border: none;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 15px;
  color: #4a5568;
  font-weight: 500;
}

.menu-item:hover {
  background: #f7fafc;
  transform: translateX(5px);
}

.menu-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.menu-icon {
  font-size: 20px;
}

.menu-text {
  flex: 1;
  text-align: left;
}

.menu-count {
  background: #fc8181;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 10px;
}

.menu-item.active .menu-count {
  background: white;
  color: #667eea;
}

.menu-arrow {
  font-size: 20px;
  opacity: 0.5;
}

/* 内容区域 */
.content-area {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

.content-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
}

.section-title {
  font-size: 22px;
  font-weight: bold;
  color: #1a202c;
}

.section-count {
  color: #718096;
  font-size: 14px;
}

.add-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.clear-btn {
  padding: 8px 16px;
  background: #f7fafc;
  color: #718096;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: #e2e8f0;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #a0aec0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.action-btn {
  margin-top: 20px;
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 商品网格 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
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

.remove-fav-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #fc8181;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s;
}

.product-card:hover .remove-fav-btn {
  opacity: 1;
}

.remove-fav-btn:hover {
  background: #fc8181;
  color: white;
}

.product-status {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.product-status.selling {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.product-status.sold {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.product-info {
  padding: 15px;
}

.product-title {
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
}

.original-price {
  font-size: 13px;
  color: #a0aec0;
  text-decoration: line-through;
}

.view-count {
  margin-left: auto;
  font-size: 13px;
  color: #a0aec0;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location {
  font-size: 13px;
  color: #718096;
}

.contact-btn {
  padding: 6px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.product-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.edit-btn,
.delete-btn {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn {
  background: #e2e8f0;
  color: #4a5568;
}

.edit-btn:hover {
  background: #cbd5e0;
}

.delete-btn {
  background: #fed7d7;
  color: #c53030;
}

.delete-btn:hover {
  background: #feb2b2;
}

/* 消息列表 */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f7fafc;
  border-radius: 12px;
  transition: all 0.3s;
  position: relative;
}

.message-item:hover {
  background: #edf2f7;
  transform: translateX(5px);
}

.message-item.unread {
  background: #ebf8ff;
  border-left: 3px solid #667eea;
}

.message-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.sender-name {
  font-weight: 600;
  color: #2d3748;
}

.message-time {
  font-size: 13px;
  color: #a0aec0;
}

.message-text {
  color: #718096;
  font-size: 14px;
  line-height: 1.5;
}

.mark-read-btn {
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.mark-read-btn:hover {
  background: #5a6fd6;
}

/* 设置表单 */
.settings-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #4a5568;
  font-size: 14px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;
  background: #f7fafc;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.save-btn,
.logout-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex: 1;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.logout-btn {
  background: #f7fafc;
  color: #718096;
}

.logout-btn:hover {
  background: #e2e8f0;
  color: #c53030;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 22px;
  font-weight: bold;
  color: #1a202c;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f7fafc;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #c53030;
}

.modal-body {
  padding: 30px;
}

.publish-modal .form-group {
  margin-bottom: 20px;
}

.publish-modal label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #4a5568;
  font-size: 14px;
}

.publish-modal input,
.publish-modal textarea,
.publish-modal select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;
  background: #f7fafc;
  font-family: inherit;
}

.publish-modal select {
  cursor: pointer;
}

.publish-modal select option {
  padding: 10px;
}

.publish-modal input:focus,
.publish-modal textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
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
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 响应式设计 */
@media (max-width: 968px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    overflow-x: auto;
  }

  .user-card {
    min-width: 280px;
  }

  .menu-list {
    min-width: 280px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}
</style>
