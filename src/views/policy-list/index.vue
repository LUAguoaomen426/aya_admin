<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.memberId" placeholder="member id" style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.memberName" placeholder="member name" style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker
        v-model="listQuery.DOB"
        type="date"
        style="width: 200px;"
        class="filter-item"
        range-separator="-"
        placeholder="DOB"
        align="right"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves class="filter-item" @click="handleReset">
        reset
      </el-button>
    </div>

    <el-table
      id="tableData"
      :key="tableKey"
      ref="table"
      v-loading="listLoading"
      :data="list"
      :height="tableHeight"
      empty-text="  "
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        type="index"
        fixed
        width="50"
      />
      <el-table-column label="member id" align="center" fixed width="200">
        <template slot-scope="{row}">
          <span>{{ row.memberId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="member name" align="center" fixed width="150">
        <template slot-scope="{row}">
          <span>{{ row.memberName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="DOB" fixed width="180">
        <template slot-scope="{row}">
          <span>{{ dateFormat(new Date(row.dob),'yyyy-MM-dd') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OP Coverage Amount" width="150">
        <template slot-scope="{row}">
          <span>{{ row.opcoverageAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="op Visit Limitation" width="150">
        <template slot-scope="{row}">
          <span>{{ row.opvisitLimitation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OP Limitation Per Visit" width="150">
        <template slot-scope="{row}">
          <span>{{ row.oplimitationpervisit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OP Copay" width="150">
        <template slot-scope="{row}">
          <span>{{ row.opcopay }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OP Limit" width="150">
        <template slot-scope="{row}">
          <span>{{ row.oplimit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OP Deductible Per Visit" width="150">
        <template slot-scope="{row}">
          <span>{{ row.opdeductiblepervisit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OP Medicine Limitation" width="150">
        <template slot-scope="{row}">
          <span>{{ row.opmedicineLimitation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OP Other Limitation" width="150">
        <template slot-scope="{row}">
          <span>{{ row.opotherLimitation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OP Special Therapy Limitation" width="250">
        <template slot-scope="{row}">
          <span>{{ row.opspecialTherapyLimitation }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="operation"
        width="100"
      >
        <template slot-scope="{row}">
          <router-link class="" :to="{ path: '/pre-auth-record', query: {groupId: row.groupId} }">
            <el-button type="text" size="small">Show Pre</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/policy.js'
import waves from '@/directive/waves' // waves directive
import { dateFormat } from '@/utils/formatDate'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'PolicyIndex',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        size: 20,
        memberId: undefined,
        memberName: undefined,
        DOB: undefined,
        sort: '+id'
      },
      tableHeight: '200px'
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 230
      // 监听窗口大小变化
      const self = this
      window.onresize = function() {
        self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 230
      }
    })
  },
  methods: {
    dateFormat,
    getList() {
      this.listLoading = true
      const queryData = {
        current: this.listQuery.current,
        size: this.listQuery.size,
        memberId: this.listQuery.memberId,
        memberName: this.listQuery.memberName,
        DOB: undefined,
        sort: this.listQuery.sort
      }
      queryData.DOB = this.listQuery.DOB ? dateFormat(this.listQuery.DOB, 'yyyy-MM-dd') : ''
      fetchList(queryData).then(response => {
        this.list = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleReset() {
      this.listQuery = {
        current: 1,
        size: 20,
        memberId: undefined,
        memberName: undefined,
        DOB: undefined,
        sort: '+id'
      }
      this.getList()
    }
  }
}
</script>
