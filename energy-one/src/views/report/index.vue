<template>
  <div class="report">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>抄表管理</span>
              <div>
                <el-button type="primary" @click="handleAddMeter">新增抄表</el-button>
                <el-button type="success" @click="handleExport">导出报表</el-button>
              </div>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="电力" name="electricity">
              <el-table :data="electricityData" style="width: 100%">
                <el-table-column prop="date" label="日期" />
                <el-table-column prop="meterNo" label="表号" />
                <el-table-column prop="reading" label="读数" />
                <el-table-column prop="usage" label="用量(kWh)" />
                <el-table-column prop="operator" label="操作人" />
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
                    <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="水" name="water">
              <el-table :data="waterData" style="width: 100%">
                <el-table-column prop="date" label="日期" />
                <el-table-column prop="meterNo" label="表号" />
                <el-table-column prop="reading" label="读数" />
                <el-table-column prop="usage" label="用量(m³)" />
                <el-table-column prop="operator" label="操作人" />
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
                    <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="天然气" name="gas">
              <el-table :data="gasData" style="width: 100%">
                <el-table-column prop="date" label="日期" />
                <el-table-column prop="meterNo" label="表号" />
                <el-table-column prop="reading" label="读数" />
                <el-table-column prop="usage" label="用量(m³)" />
                <el-table-column prop="operator" label="操作人" />
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
                    <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="蒸汽" name="steam">
              <el-table :data="steamData" style="width: 100%">
                <el-table-column prop="date" label="日期" />
                <el-table-column prop="meterNo" label="表号" />
                <el-table-column prop="reading" label="读数" />
                <el-table-column prop="usage" label="用量(t)" />
                <el-table-column prop="operator" label="操作人" />
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
                    <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增/编辑抄表对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增抄表' : '编辑抄表'"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="表号">
          <el-input v-model="form.meterNo" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="读数">
          <el-input-number v-model="form.reading" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="form.operator" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('electricity')
const dialogVisible = ref(false)
const dialogType = ref('add')
const form = ref({
  meterNo: '',
  date: '',
  reading: 0,
  operator: ''
})

// Mock data
const electricityData = ref([
  {
    date: '2024-04-01',
    meterNo: 'EL-001',
    reading: 12500,
    usage: 1200,
    operator: '张三'
  },
  {
    date: '2024-04-02',
    meterNo: 'EL-001',
    reading: 13700,
    usage: 1300,
    operator: '李四'
  }
])

const waterData = ref([
  {
    date: '2024-04-01',
    meterNo: 'WT-001',
    reading: 500,
    usage: 50,
    operator: '张三'
  }
])

const gasData = ref([
  {
    date: '2024-04-01',
    meterNo: 'GS-001',
    reading: 300,
    usage: 30,
    operator: '张三'
  }
])

const steamData = ref([
  {
    date: '2024-04-01',
    meterNo: 'ST-001',
    reading: 200,
    usage: 20,
    operator: '张三'
  }
])

const handleAddMeter = () => {
  dialogType.value = 'add'
  form.value = {
    meterNo: '',
    date: '',
    reading: 0,
    operator: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  // 实现删除逻辑
}

const handleSubmit = () => {
  // 实现提交逻辑
  dialogVisible.value = false
}

const handleExport = () => {
  // 实现导出逻辑
}
</script>

<script>
export default {
  name: 'ReportView'
}
</script>

<style scoped>
.report {
  margin-top: -32px;
  padding: 16px 0 16px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 