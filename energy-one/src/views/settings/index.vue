<template>
  <div class="settings">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="用户管理" name="users">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户列表</span>
              <el-button type="primary" @click="handleAddUser">新增用户</el-button>
            </div>
          </template>
          <el-table :data="users" style="width: 100%">
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="role" label="角色" />
            <el-table-column prop="department" label="部门" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="phone" label="电话" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEditUser(row)">编辑</el-button>
                <el-button type="primary" link @click="handleResetPassword(row)">重置密码</el-button>
                <el-button type="danger" link @click="handleDeleteUser(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="KPI管理" name="kpi">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>KPI指标设置</span>
              <el-button type="primary" @click="handleAddKPI">新增指标</el-button>
            </div>
          </template>
          <el-table :data="kpiSettings" style="width: 100%">
            <el-table-column prop="name" label="指标名称" />
            <el-table-column prop="type" label="类型" />
            <el-table-column prop="unit" label="单位" />
            <el-table-column prop="target" label="目标值" />
            <el-table-column prop="warning" label="警告值" />
            <el-table-column prop="danger" label="危险值" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEditKPI(row)">编辑</el-button>
                <el-button type="danger" link @click="handleDeleteKPI(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="告警设置" name="alarm">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>告警等级设置</span>
              <el-button type="primary" @click="handleAddAlarmLevel">新增等级</el-button>
            </div>
          </template>
          <el-table :data="alarmLevels" style="width: 100%">
            <el-table-column prop="level" label="等级" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="color" label="颜色">
              <template #default="{ row }">
                <el-tag :type="row.color">{{ row.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEditAlarmLevel(row)">编辑</el-button>
                <el-button type="danger" link @click="handleDeleteAlarmLevel(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="成本计价" name="cost">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>峰谷平时段设置</span>
              <el-button type="primary" @click="handleAddTimeSlot">新增时段</el-button>
            </div>
          </template>
          <el-table :data="timeSlots" style="width: 100%">
            <el-table-column prop="type" label="时段类型" />
            <el-table-column prop="startTime" label="开始时间" />
            <el-table-column prop="endTime" label="结束时间" />
            <el-table-column prop="price" label="价格(元/kWh)" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEditTimeSlot(row)">编辑</el-button>
                <el-button type="danger" link @click="handleDeleteTimeSlot(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="设备档案" name="devices">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>设备台账</span>
              <el-button type="primary" @click="handleAddDevice">新增设备</el-button>
            </div>
          </template>
          <el-table :data="devices" style="width: 100%">
            <el-table-column prop="code" label="设备编号" />
            <el-table-column prop="name" label="设备名称" />
            <el-table-column prop="type" label="设备类型" />
            <el-table-column prop="location" label="安装位置" />
            <el-table-column prop="specification" label="规格型号" />
            <el-table-column prop="manufacturer" label="制造商" />
            <el-table-column prop="installDate" label="安装日期" />
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEditDevice(row)">编辑</el-button>
                <el-button type="danger" link @click="handleDeleteDevice(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('users')

// Mock data for users
const users = ref([
  {
    username: 'admin',
    role: '系统管理员',
    department: '信息中心',
    email: 'admin@example.com',
    phone: '13800138000'
  },
  {
    username: 'operator',
    role: '操作员',
    department: '生产部',
    email: 'operator@example.com',
    phone: '13800138001'
  }
])

// Mock data for KPI settings
const kpiSettings = ref([
  {
    name: '单位产品电耗',
    type: '电力',
    unit: 'kWh/件',
    target: 0.8,
    warning: 1.0,
    danger: 1.2
  }
])

// Mock data for alarm levels
const alarmLevels = ref([
  {
    level: 'high',
    name: '高',
    color: 'danger',
    description: '需要立即处理的告警'
  },
  {
    level: 'medium',
    name: '中',
    color: 'warning',
    description: '需要尽快处理的告警'
  },
  {
    level: 'low',
    name: '低',
    color: 'info',
    description: '一般告警'
  }
])

// Mock data for time slots
const timeSlots = ref([
  {
    type: '峰时',
    startTime: '08:00',
    endTime: '12:00',
    price: 1.2
  },
  {
    type: '平时',
    startTime: '12:00',
    endTime: '18:00',
    price: 0.8
  },
  {
    type: '谷时',
    startTime: '18:00',
    endTime: '08:00',
    price: 0.4
  }
])

// Mock data for devices
const devices = ref([
  {
    code: 'EL-001',
    name: 'A区主变压器',
    type: '变压器',
    location: 'A区配电室',
    specification: 'S11-1000/10',
    manufacturer: 'ABB',
    installDate: '2020-01-01'
  }
])

// User management handlers
const handleAddUser = () => {
  // 实现新增用户逻辑
}

const handleEditUser = (row) => {
  // 实现编辑用户逻辑
}

const handleResetPassword = (row) => {
  // 实现重置密码逻辑
}

const handleDeleteUser = (row) => {
  // 实现删除用户逻辑
}

// KPI management handlers
const handleAddKPI = () => {
  // 实现新增KPI逻辑
}

const handleEditKPI = (row) => {
  // 实现编辑KPI逻辑
}

const handleDeleteKPI = (row) => {
  // 实现删除KPI逻辑
}

// Alarm level handlers
const handleAddAlarmLevel = () => {
  // 实现新增告警等级逻辑
}

const handleEditAlarmLevel = (row) => {
  // 实现编辑告警等级逻辑
}

const handleDeleteAlarmLevel = (row) => {
  // 实现删除告警等级逻辑
}

// Time slot handlers
const handleAddTimeSlot = () => {
  // 实现新增时段逻辑
}

const handleEditTimeSlot = (row) => {
  // 实现编辑时段逻辑
}

const handleDeleteTimeSlot = (row) => {
  // 实现删除时段逻辑
}

// Device handlers
const handleAddDevice = () => {
  // 实现新增设备逻辑
}

const handleEditDevice = (row) => {
  // 实现编辑设备逻辑
}

const handleDeleteDevice = (row) => {
  // 实现删除设备逻辑
}
</script>

<script>
export default {
  name: 'SettingsView'
}
</script>

<style scoped>
.settings {
  margin-top: -32px;
  padding: 16px 0 16px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 