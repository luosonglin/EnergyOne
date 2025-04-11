<template>
  <el-container class="app-container">
    <el-header class="header">
      <div class="header-left">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" class="logo-img" />
          <h1 class="logo-text">EnergyOne</h1>
          <div class="logo-divider"></div>
          <span class="logo-subtitle">用AI管理每一度的精彩</span>
        </div>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user-info">
            <el-avatar :size="32" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    
    <el-container class="main-container">
      <el-aside width="200px" class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/monitor">
            <el-icon><Monitor /></el-icon>
            <span>监控</span>
          </el-menu-item>
          <el-menu-item index="/analysis">
            <el-icon><DataAnalysis /></el-icon>
            <span>分析</span>
          </el-menu-item>
          <el-menu-item index="/report">
            <el-icon><Document /></el-icon>
            <span>报表</span>
          </el-menu-item>
          <el-menu-item index="/alarm">
            <el-icon><Bell /></el-icon>
            <span>告警</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>系统</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import {
  HomeFilled,
  Monitor,
  DataAnalysis,
  Document,
  Bell,
  Setting
} from '@element-plus/icons-vue'
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
</style>

<style scoped>
.app-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
  height: 100%;
}

.logo-img {
  height: 32px;
  margin-right: 12px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.logo-divider {
  width: 1px;
  height: 16px;
  background-color: #e5e6eb;
  margin: 0 16px;
}

.logo-subtitle {
  font-size: 14px;
  color: #86909c;
}

.main-container {
  margin-top: 64px;
  height: calc(100vh - 64px);
  overflow: hidden;
  display: flex;
  flex-direction: row;
}

.sidebar {
  background-color: #fff;
  border-right: 1px solid #ebeef5;
  padding-top: 16px;
}

.el-menu-vertical {
  border-right: none;
}

.el-menu-item {
  height: 48px;
  line-height: 48px;
  margin: 4px 0;
  padding: 0 20px !important;
}

.el-menu-item.is-active {
  background-color: #e8f3ff !important;
  color: #409eff !important;
  border-radius: 4px;
  margin: 4px 0;
  width: 100%;
}

.el-menu-item:hover {
  background-color: #f5f6f7 !important;
  border-radius: 4px;
  margin: 4px 0;
  width: 100%;
}

.el-menu-item .el-icon {
  font-size: 18px;
  margin-right: 12px;
}

.el-main {
  background-color: #f6f8fa;
  padding: 32px 16px;
  height: 100%;
  overflow-y: auto;
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 8px;
  height: 40px;
  border-radius: 20px;
  transition: all 0.3s;
}

.user-info:hover {
  background-color: #f5f6f7;
}

:deep(.el-menu--popup) {
  min-width: 140px;
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 16px;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item:not(.is-disabled):hover) {
  background-color: #f5f6f7;
  color: #1a1a1a;
}

:deep(.el-menu-item) span {
  font-size: 14px;
  margin-left: 4px;
}
::-webkit-scrollbar {
  width: 0 !important;
}
   
::-webkit-scrollbar {
  width: 0 !important;height: 0;
}

</style> 