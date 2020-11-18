<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.claimNumber" placeholder="claim number" style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      visit date:<el-date-picker
        v-model="listQuery.visitDate"
        type="daterange"
        style="width: 400px;"
        class="filter-item"
        range-separator="-"
        start-placeholder="Start Time"
        end-placeholder="End Time"
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
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      stripe
      fit
      highlight-current-row
      empty-text="  "
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        fixed
        width="50"
      />
      <el-table-column label="claim number" prop="claim number" align="center">
        <template slot-scope="{row}">
          <span>{{ row.claimNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="provider" prop="provider" align="center">
        <template slot-scope="{row}">
          <span>{{ row.provider }}</span>
        </template>
      </el-table-column>
      <el-table-column label="member id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.memberId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="member name" align="center">
        <template slot-scope="{row}">
          <span>{{ row.memberName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="DOB">
        <template slot-scope="{row}">
          <span>{{ dateFormat(new Date(row.dob),'yyyy-MM-dd') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="visit date">
        <template slot-scope="{row}">
          <span>{{ dateFormat(new Date(row.visitDate),'yyyy-MM-dd') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="total amount">
        <template slot-scope="{row}">
          <span>{{ row.totalAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="claim amount">
        <template slot-scope="{row}">
          <span>{{ row.claimAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="note">
        <template slot-scope="{row}">
          <span>{{ row.note }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/claim.js'
import waves from '@/directive/waves' // waves directive
import { dateFormat } from '@/utils/formatDate'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ClaimIndex',
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
        claimNumber: undefined,
        memberId: undefined,
        memberName: undefined,
        DOB: undefined,
        visitDate: undefined,
        visitStartTime: undefined,
        visitEndTime: undefined,
        sort: '+id'
      }
    }
  },
  methods: {
    dateFormat,
    getList() {
      this.listLoading = true
      const queryData = {
        current: this.listQuery.current,
        size: this.listQuery.size,
        claimNumber: this.listQuery.claimNumber,
        memberId: this.listQuery.memberId,
        memberName: this.listQuery.memberName,
        DOB: undefined,
        visitStartTime: undefined,
        visitEndTime: undefined,
        sort: this.listQuery.sort
      }
      queryData.DOB = this.listQuery.DOB ? dateFormat(this.listQuery.DOB, 'yyyy-MM-dd') : ''
      queryData.visitStartTime = this.listQuery.visitDate ? dateFormat(this.listQuery.visitDate[0], 'yyyy-MM-dd') + ' 00:00:00' : ''
      queryData.visitEndTime = this.listQuery.visitDate ? dateFormat(this.listQuery.visitDate[1], 'yyyy-MM-dd') + ' 00:00:00' : ''
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
        claimNumber: undefined,
        memberId: undefined,
        memberName: undefined,
        DOB: undefined,
        visitDate: undefined,
        visitStartTime: undefined,
        visitEndTime: undefined,
        sort: '+id'
      }
      this.getList()
    }
  }
}
</script>
