<template>
  <div class="monitor">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="device-diagram">
          <template #header>
            <div class="card-header">
              <span>设备接线图</span>
              <el-button type="primary" size="small">刷新</el-button>
            </div>
          </template>
          <div class="diagram-container">
            <!-- Placeholder for device diagram -->
            <div class="placeholder-diagram">
              <el-empty description="设备接线图加载中..." />
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="device-list">
          <template #header>
            <div class="card-header">
              <span>设备列表</span>
              <el-input
                v-model="searchQuery"
                placeholder="搜索设备"
                prefix-icon="Search"
                style="width: 200px"
              />
            </div>
          </template>
          <el-table :data="filteredDevices" style="width: 100%">
            <el-table-column prop="name" label="设备名称" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status === 'normal' ? 'success' : 'danger'">
                  {{ row.status === 'normal' ? '正常' : '异常' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="power" label="功率(kW)" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>实时能耗数据</span>
            </div>
          </template>
          <div ref="realTimeChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>历史电参数对比</span>
            </div>
          </template>
          <div ref="historyChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'

const devices = ref([
  { id: 1, name: 'A区主变压器', status: 'normal', power: 1250 },
  { id: 2, name: 'B区主变压器', status: 'normal', power: 980 },
  { id: 3, name: 'C区主变压器', status: 'abnormal', power: 0 },
  { id: 4, name: 'D区主变压器', status: 'normal', power: 850 },
  { id: 5, name: 'E区主变压器', status: 'normal', power: 720 }
])

const searchQuery = ref('')
const realTimeChart = ref(null)
const historyChart = ref(null)

const filteredDevices = computed(() => {
  return devices.value.filter(device => 
    device.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const initRealTimeChart = () => {
  const chart = echarts.init(realTimeChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
    },
    yAxis: {
      type: 'value',
      name: '功率 (kW)'
    },
    series: [{
      data: [1200, 1320, 1010, 1340, 900, 2300, 2100],
      type: 'line',
      smooth: true,
      areaStyle: {}
    }]
  }
  chart.setOption(option)
}

const initHistoryChart = () => {
  const chart = echarts.init(historyChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['电压', '电流', '功率因数']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: [
      {
        type: 'value',
        name: '电压 (V)',
        position: 'left'
      },
      {
        type: 'value',
        name: '电流 (A)',
        position: 'right'
      }
    ],
    series: [
      {
        name: '电压',
        type: 'line',
        data: [380, 382, 381, 379, 380, 381]
      },
      {
        name: '电流',
        type: 'line',
        yAxisIndex: 1,
        data: [1200, 1320, 1010, 1340, 900, 1100]
      },
      {
        name: '功率因数',
        type: 'line',
        data: [0.95, 0.96, 0.94, 0.95, 0.96, 0.95]
      }
    ]
  }
  chart.setOption(option)
}

onMounted(() => {
  initRealTimeChart()
  initHistoryChart()
})
</script>

<script>
export default {
  name: 'MonitorView'
}
</script>

<style scoped>
.monitor {
  margin-top: -32px;
  padding: 16px 0 16px 0;
}

.device-diagram {
  margin-bottom: 20px;
}

.diagram-container {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.placeholder-diagram {
  text-align: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-row {
  margin-top: 20px;
}
</style> 