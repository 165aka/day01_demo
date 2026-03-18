<template>
  <div class="register-container">
    <!-- 动态背景 -->
    <div class="animated-background">
      <div class="gradient-sphere sphere-1"></div>
      <div class="gradient-sphere sphere-2"></div>
      <div class="gradient-sphere sphere-3"></div>
    </div>

    <!-- 注册卡片 -->
    <div class="register-card" :class="{ shake: shakeCard }">
      <div class="card-header">
        <div class="logo">
          <div class="logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              />
            </svg>
          </div>
          <h1>创建账户</h1>
        </div>
        <p class="subtitle">注册一个新账户以开始使用</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <!-- 用户名输入 -->
        <div
          class="form-group"
          :class="{
            focused: focusedField === 'username',
            filled: form.username,
          }"
        >
          <label for="username">用户名</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="请输入用户名"
              @focus="focusedField = 'username'"
              @blur="focusedField = null"
              :class="{ error: errors.username }"
            />
          </div>
          <span class="error-message" v-if="errors.username">{{
            errors.username
          }}</span>
        </div>

        <!-- 邮箱输入 -->
        <div
          class="form-group"
          :class="{ focused: focusedField === 'email', filled: form.email }"
        >
          <label for="email">邮箱地址</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="name@example.com"
              @focus="focusedField = 'email'"
              @blur="focusedField = null"
              :class="{ error: errors.email }"
            />
          </div>
          <span class="error-message" v-if="errors.email">{{
            errors.email
          }}</span>
        </div>

        <!-- 密码输入 -->
        <div
          class="form-group"
          :class="{
            focused: focusedField === 'password',
            filled: form.password,
          }"
        >
          <label for="password">密码</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              @focus="focusedField = 'password'"
              @blur="focusedField = null"
              :class="{ error: errors.password }"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <svg
                v-if="!showPassword"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
          <span class="error-message" v-if="errors.password">{{
            errors.password
          }}</span>
        </div>

        <!-- 确认密码输入 -->
        <div
          class="form-group"
          :class="{
            focused: focusedField === 'confirmPassword',
            filled: form.confirmPassword,
          }"
        >
          <label for="confirmPassword">确认密码</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="••••••••"
              @focus="focusedField = 'confirmPassword'"
              @blur="focusedField = null"
              :class="{ error: errors.confirmPassword }"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <svg
                v-if="!showConfirmPassword"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
          <span class="error-message" v-if="errors.confirmPassword">{{
            errors.confirmPassword
          }}</span>
        </div>

        <!-- 协议勾选 -->
        <div class="form-options">
          <label class="checkbox-wrapper">
            <input type="checkbox" v-model="form.agreeTerms" />
            <span class="checkmark"></span>
            <span class="label-text"
              >我已阅读并同意 <a href="#">用户协议</a> 和
              <a href="#">隐私政策</a></span
            >
          </label>
        </div>

        <!-- 注册按钮 -->
        <button
          type="submit"
          class="submit-btn"
          :disabled="isLoading"
          :class="{ loading: isLoading }"
        >
          <span class="btn-text" v-if="!isLoading">立即注册</span>
          <span class="btn-loader" v-else>
            <span class="loader-dot"></span>
            <span class="loader-dot"></span>
            <span class="loader-dot"></span>
          </span>
        </button>
      </form>

      <!-- 登录链接 -->
      <div class="login-link">
        已有账户？<router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "blank",
  data() {
    return {
      form: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
      },
      errors: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: "",
      },
      focusedField: null,
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      shakeCard: false,
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      // 清空错误
      this.errors.username = "";
      this.errors.email = "";
      this.errors.password = "";
      this.errors.confirmPassword = "";
      this.errors.agreeTerms = "";

      // 用户名验证
      if (!this.form.username) {
        this.errors.username = "请输入用户名";
        isValid = false;
      } else if (this.form.username.length < 3) {
        this.errors.username = "用户名长度至少为 3 位";
        isValid = false;
      }

      // 邮箱验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form.email) {
        this.errors.email = "请输入邮箱地址";
        isValid = false;
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = "请输入有效的邮箱地址";
        isValid = false;
      }

      // 密码验证
      if (!this.form.password) {
        this.errors.password = "请输入密码";
        isValid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = "密码长度至少为 6 位";
        isValid = false;
      }

      // 确认密码验证
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = "请确认密码";
        isValid = false;
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "两次输入的密码不一致";
        isValid = false;
      }

      // 协议验证
      if (!this.form.agreeTerms) {
        this.errors.agreeTerms = "请同意用户协议和隐私政策";
        isValid = false;
      }

      return isValid;
    },

    async handleRegister() {
      if (!this.validateForm()) {
        this.shakeCard = true;
        setTimeout(() => {
          this.shakeCard = false;
        }, 500);
        return;
      }

      this.isLoading = true;

      try {
        const res = await this.$axios.post("/api/user/register", {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
        });

        console.log("注册成功", res);

        // 注册成功后跳转到登录页
        this.$router.push("/login");

        // 可选：显示成功提示
        alert("注册成功！请登录");
      } catch (error) {
        console.error("注册失败", error);
        // 显示后端返回的错误信息
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          this.errors.email = error.response.data.message;
        } else {
          alert("注册失败，请稍后重试");
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 注册容器 */
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 动态背景 */
.animated-background {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s infinite ease-in-out;
}

.sphere-1 {
  width: 400px;
  height: 400px;
  background: #ff6b6b;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.sphere-2 {
  width: 300px;
  height: 300px;
  background: #4ecdc4;
  bottom: -50px;
  right: -50px;
  animation-delay: -5s;
}

.sphere-3 {
  width: 250px;
  height: 250px;
  background: #ffe66d;
  top: 50%;
  left: 50%;
  animation-delay: -10s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* 注册卡片 */
.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  position: relative;
  z-index: 10;
  animation: slideUp 0.6s ease-out;
  transition: transform 0.3s ease;
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

/* 抖动动画 */
.shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

/* 卡片头部 */
.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4);
}

.logo-icon svg {
  width: 32px;
  height: 32px;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #718096;
  font-size: 15px;
  margin-top: 8px;
}

/* 表单样式 */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  transition: color 0.3s ease;
}

.form-group.focused label {
  color: #667eea;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #a0aec0;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-icon svg {
  width: 20px;
  height: 20px;
}

.form-group.focused .input-icon {
  color: #667eea;
}

input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #f7fafc;
  color: #2d3748;
}

input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

input.error {
  border-color: #fc8181;
  background: #fff5f5;
}

input.error:focus {
  box-shadow: 0 0 0 4px rgba(252, 129, 129, 0.1);
}

.toggle-password {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #a0aec0;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #667eea;
}

.toggle-password svg {
  width: 20px;
  height: 20px;
}

.error-message {
  font-size: 13px;
  color: #e53e3e;
  margin-top: 4px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 选项栏 */
.form-options {
  margin-top: 4px;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #4a5568;
  user-select: none;
}

.checkbox-wrapper input {
  display: none;
  margin-top: 2px;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  flex-shrink: 0;
}

.checkbox-wrapper input:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-wrapper input:checked + .checkmark::after {
  content: "";
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  position: absolute;
  top: 1px;
}

.checkbox-wrapper .label-text a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.checkbox-wrapper .label-text a:hover {
  text-decoration: underline;
}

/* 提交按钮 */
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
  transition: all 0.3s ease;
  margin-top: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.2);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(102, 126, 234, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-text {
  display: inline-block;
  transition: opacity 0.3s ease;
}

/* 加载动画 */
.btn-loader {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
}

.loader-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loader-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loader-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 登录链接 */
.login-link {
  text-align: center;
  margin-top: 24px;
  color: #718096;
  font-size: 14px;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.3s ease;
}

.login-link a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-card {
    margin: 16px;
    padding: 32px 24px;
  }

  .gradient-sphere {
    filter: blur(60px);
  }

  .sphere-1 {
    width: 200px;
    height: 200px;
  }

  .sphere-2 {
    width: 150px;
    height: 150px;
  }

  .sphere-3 {
    width: 120px;
    height: 120px;
  }
}
</style>
