<template>
  <div class="login-container">
    <!-- 动态背景 -->
    <div class="animated-background">
      <div class="gradient-sphere sphere-1"></div>
      <div class="gradient-sphere sphere-2"></div>
      <div class="gradient-sphere sphere-3"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card" :class="{ shake: shakeCard }">
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
          <h1>欢迎回来</h1>
        </div>
        <p class="subtitle">请登录您的账户以继续</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
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

        <!-- 选项栏 -->
        <div class="form-options">
          <label class="checkbox-wrapper">
            <input type="checkbox" v-model="form.rememberMe" />
            <span class="checkmark"></span>
            <span class="label-text">记住我</span>
          </label>
          <a href="#" class="forgot-link">忘记密码？</a>
        </div>

        <!-- 登录按钮 -->
        <button
          type="submit"
          class="submit-btn"
          :disabled="isLoading"
          :class="{ loading: isLoading }"
        >
          <span class="btn-text" v-if="!isLoading">登录</span>
          <span class="btn-loader" v-else>
            <span class="loader-dot"></span>
            <span class="loader-dot"></span>
            <span class="loader-dot"></span>
          </span>
        </button>
      </form>

      <!-- 社交登录 -->
      <div class="social-login">
        <div class="divider">
          <span>或使用以下方式登录</span>
        </div>
        <div class="social-buttons">
          <button class="social-btn google" @click="socialLogin('google')">
            <svg viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </button>
          <button class="social-btn github" @click="socialLogin('github')">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
          </button>
          <button class="social-btn wechat" @click="socialLogin('wechat')">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 注册链接 -->
      <div class="signup-link">
        还没有账户？<router-link to="/register">立即注册</router-link>
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
        email: "",
        password: "",
        rememberMe: false,
      },
      errors: {
        email: "",
        password: "",
      },
      focusedField: null,
      showPassword: false,
      isLoading: false,
      shakeCard: false,
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors.email = "";
      this.errors.password = "";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form.email) {
        this.errors.email = "请输入邮箱地址";
        isValid = false;
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = "请输入有效的邮箱地址";
        isValid = false;
      }

      if (!this.form.password) {
        this.errors.password = "请输入密码";
        isValid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = "密码长度至少为 6 位";
        isValid = false;
      }

      return isValid;
    },

    async handleLogin() {
      if (!this.validateForm()) {
        this.shakeCard = true;
        setTimeout(() => {
          this.shakeCard = false;
        }, 500);
        return;
      }

      this.isLoading = true;

      try {
        const res = await this.$axios.post("/api/user/login", {
          email: this.form.email,
          password: this.form.password,
        });

        // 🔍 详细调试日志
        console.log("=== 登录响应调试 ===");
        console.log("res:", res);
        console.log("res.data:", res.data);
        console.log("res 是否有 other:", "other" in (res || {}));
        console.log("res.data 是否有 other:", "other" in (res.data || {}));
        console.log("res.data 是否有 userId:", "userId" in (res.data || {}));
        console.log("=====================");

        // ✅ 判断是否被拦截器解包
        // 如果 res.data 直接包含 userId/nickname，说明已解包
        const isUnwrapped = res.data?.userId || res.data?.nickname;

        let token, userData;

        if (isUnwrapped) {
          // 情况 1: 已解包 - token 可能在 res.other 或响应头
          token =
            res.other?.token ||
            res.headers?.authorization ||
            res.headers?.["x-auth-token"];
          userData = res.data;
        } else {
          // 情况 2: 未解包 - 正常获取
          token = res.data?.other?.token || res.data?.token;
          userData = res.data?.data || res.data;
        }

        console.log("获取到的 token:", token);
        console.log("获取到的 userData:", userData);

        if (!token) {
          console.error("❌ token 获取失败");
          console.error("res 完整结构:", JSON.stringify(res, null, 2));
          throw new Error("登录失败：未获取到认证令牌");
        }

        // 存储 token
        localStorage.setItem("token", token);

        // 存储用户信息
        const userInfo = {
          id: userData?.userId || userData?.id || Date.now().toString(),
          name:
            userData?.nickname ||
            userData?.username ||
            userData?.name ||
            "用户",
          avatar:
            userData?.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
          username:
            userData?.nickname ||
            userData?.username ||
            this.form.email.split("@")[0],
          email: userData?.email || this.form.email,
        };

        console.log("✅ 存储的用户信息:", userInfo);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        // 跳转到首页
        this.$router.push("/home");
      } catch (error) {
        console.error("登录失败", error);
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "登录失败，请稍后重试";
        alert("登录失败：" + errorMsg);
      } finally {
        this.isLoading = false;
      }
    },

    socialLogin(provider) {
      console.log(`使用 ${provider} 登录`);
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

/* 登录容器 */
.login-container {
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

/* 登录卡片 */
.login-card {
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
.login-form {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #4a5568;
  user-select: none;
}

.checkbox-wrapper input {
  display: none;
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

.forgot-link {
  font-size: 14px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #764ba2;
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

/* 社交登录 */
.social-login {
  margin-top: 28px;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 20px;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
}

.divider span {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 16px;
  color: #a0aec0;
  font-size: 14px;
  position: relative;
}

.social-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.social-btn {
  width: 48px;
  height: 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0;
}

.social-btn:hover {
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-btn svg {
  width: 24px;
  height: 24px;
}

.social-btn.google:hover {
  border-color: #4285f4;
}

.social-btn.github {
  color: #24292e;
}

.social-btn.github:hover {
  border-color: #24292e;
  background: #24292e;
  color: white;
}

.social-btn.wechat {
  color: #07c160;
}

.social-btn.wechat:hover {
  border-color: #07c160;
  background: #07c160;
  color: white;
}

/* 注册链接 */
.signup-link {
  text-align: center;
  margin-top: 24px;
  color: #718096;
  font-size: 14px;
}

.signup-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.3s ease;
}

.signup-link a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
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
