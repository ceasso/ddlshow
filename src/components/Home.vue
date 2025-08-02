<template>
  <div class="modern-container">
    <!-- 现代化头部 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="gradient-text">活动日历</span>

        </h1>

      </div>
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-number">{{ showNumber }}</div>
          <div class="stat-label">活动总数</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ categories.length }}</div>
          <div class="stat-label">分类数量</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ Array.from(allTags).length }}</div>
          <div class="stat-label">标签数量</div>
        </div>
      </div>
    </div>

    <!-- 现代化筛选区域 -->
    <div class="filter-section">
      <div class="filter-container">
        <!-- 搜索框 -->
        <div class="search-box">
          <i class="el-icon-search search-icon"></i>
          <input 
            v-model="input" 
            @input="handleInputChange"
            placeholder="搜索活动或关键词..."
            class="search-input"
          />
        </div>

        <!-- 分类筛选 -->
        <div class="category-filters">
          <div class="filter-title">分类筛选</div>
          <div class="category-chips">
            <div 
              v-for="cat in categories" 
              :key="cat.id"
              :class="['category-chip', { active: selectedCategories.includes(cat.id) }]"
              @click="toggleCategory(cat.id)"
            >
              {{ formatCategoryName(cat) }}
            </div>
          </div>
        </div>

        <!-- 标签筛选 -->
        <div class="tag-filters">
          <div class="filter-title">标签筛选</div>
          <el-select 
            v-model="selectedTags" 
            multiple 
            filterable 
            placeholder="选择标签..." 
            class="tag-select"
            @change="handleTagChange"
          >
            <el-option
              v-for="tag in Array.from(allTags)"
              :key="tag"
              :label="tag"
              :value="tag">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

    <!-- 现代化表格 -->
    <div class="events-section">
      <div class="table-container">
        <el-table 
          :data="showList" 
          style="width: 100%"
          :row-class-name="getRowClassName"
          class="modern-table"
        >
          <!-- 收藏列 -->
          <el-table-column width="60" align="center">
            <template slot-scope="scope">
              <i 
                :class="['star-icon', scope.row.isLike ? 'el-icon-star-on liked' : 'el-icon-star-off']"
                @click="handleClickIcon(scope.row)"
              ></i>
            </template>
          </el-table-column>

          <!-- 活动名称 -->
          <el-table-column label="活动名称" min-width="200">
            <template slot-scope="scope">
              <div class="title-cell">
                <a :href="scope.row.link" target="_blank" class="title-link">
                  {{ scope.row.title }} {{ scope.row.year }}
                </a>
                <span :class="['category-badge', scope.row.category]">
                  {{ scope.row.category }}
                </span>
              </div>
              <div class="description-text">{{ scope.row.description }}</div>
            </template>
          </el-table-column>

          <!-- 地点和时间 -->
          <el-table-column label="地点/时间" min-width="180">
            <template slot-scope="scope">
              <div class="location-info">
                <div class="info-item">
                  <i class="el-icon-location-outline"></i>
                  {{ scope.row.place }}
                </div>
                <div class="info-item">
                  <i class="el-icon-date"></i>
                  {{ scope.row.date }}
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 标签 -->
          <el-table-column label="标签" min-width="150">
            <template slot-scope="scope">
              <div class="tags-cell" v-if="scope.row.tags && scope.row.tags.length">
                <span 
                  v-for="tag in scope.row.tags.slice(0, 3)" 
                  :key="tag" 
                  class="tag-chip"
                >
                  {{ tag }}
                </span>
                <span v-if="scope.row.tags.length > 3" class="more-tags">
                  +{{ scope.row.tags.length - 3 }}
                </span>
              </div>
            </template>
          </el-table-column>

          <!-- 截止时间 -->
          <el-table-column label="截止时间" min-width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 'TBD'" class="tbd-status">
                截止日期待定
              </div>
              <div v-else-if="scope.row.status === 'FIN'" class="finished-status">
                已结束
              </div>
              <div v-else class="deadline-cell">
                <div class="next-step-hint">下一步事件</div>
                <div class="deadline-text">{{ scope.row.chineseDeadline }}</div>
                <div v-if="scope.row.comment" class="comment-text">
                  <i class="el-icon-info"></i>
                  {{ scope.row.comment }}
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 倒计时 -->
          <el-table-column label="倒计时" width="150" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 'RUN'" class="countdown-cell">
                <countdown :time="scope.row.remain" :transform="transform">
                  <template slot-scope="props">
                    <div class="countdown-compact">
                      <span class="countdown-part">{{ props.days.split(' ')[0] }}天</span>
                      <span class="countdown-part">{{ props.hours.split(' ')[0] }}时</span>
                      <span class="countdown-part">{{ props.minutes.split(' ')[0] }}分</span>
                    </div>
                  </template>
                </countdown>
              </div>
              <div v-else-if="scope.row.status === 'TBD'" class="status-text tbd">
                待定
              </div>
              <div v-else class="status-text finished">
                已结束
              </div>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <div class="action-buttons" v-if="scope.row.status !== 'TBD'">
                <a 
                  :href="formatGoogleCalendar(scope.row)" 
                  target="_blank" 
                  class="action-btn google"
                  title="添加到 Google 日历"
                >
                  <i class="el-icon-date"></i>
                </a>
                <a 
                  :href="formatiCloudCalendar(scope.row)" 
                  class="action-btn icloud"
                  title="添加到 iCloud 日历"
                >
                  <i class="el-icon-time"></i>
                </a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          :current-page="page"
          :total="showNumber"
          class="modern-pagination">
        </el-pagination>
      </div>
    </div>

    <!-- 现代化页脚 -->
    <footer class="modern-footer">
      <div class="footer-content">
        <div class="footer-info">
          <p>学术活动截止日期追踪工具</p>
          <p>帮助您不错过任何重要的学术机会</p>
        </div>
        <div class="footer-note">
          <p>时区: {{ timeZone }} | 数据仅供参考</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
const yaml = require('js-yaml')
const moment = require('moment-timezone')
const tz = moment.tz.guess()

export default {
  name: "Home",
  components: {
    // 移除TimeLine组件，因为表格布局中不需要
  },
  data() {
    return {
      // General
      publicPath: process.env.NODE_ENV === 'production' ? '/ddlshow/' : '/',
      timeZone: '',
      input: '',
      
      // Data
      allEvents: [],
      allTags: new Set(),
      categories: [],
      
      // UI Control
      checkAll: true,
      isIndeterminate: false,
      pageSize: 10,
      page: 1,
      
      // Filters
      selectedCategories: [],
      selectedTags: [],

      // Display
      showList: [],
      showNumber: 0,

      // Cache
      cachedLikes: [],
    }
  },
  methods: {
    // --- Data Loading and Processing ---
    loadData() {
      this.timeZone = tz;

      const categoriesPromise = this.$http.get(`${this.publicPath}events/categories.yml`).then(response => {
        this.categories = yaml.load(response.body);
        this.selectedCategories = this.categories.map(c => c.id); // Select all by default
        this.checkAll = true;
      });

      const eventsPromise = this.$http.get(`${this.publicPath}events/allevents.yml`).then(response => {
        const eventGroups = yaml.load(response.body);
        this.processEventGroups(eventGroups);
      });

      Promise.all([categoriesPromise, eventsPromise]).then(() => {
        this.loadCachedLikes();
        this.updateDisplay();
      }).catch((error) => {
        console.error('数据加载失败:', error);
        // 使用更友好的错误提示，而不是alert
        this.$message({
          message: '数据加载失败，请检查网络连接后刷新页面',
          type: 'warning',
          duration: 5000
        });
      });
    },

    processEventGroups(groups) {
      let processedEvents = [];
      const now = moment.tz(new Date(), tz);

      for (const group of groups) {
        if (group.events) {
          for (const event of group.events) {
            let deadline = null;
            let comment = '';
            let status = 'TBD';
            let remain = 0;
            let upcomingDeadline = null;

            // Find the next upcoming deadline
            if (event.timeline) {
              const allDeadlines = event.timeline
                .map(t => ({ ...t, time: moment.tz(t.deadline, event.timezone) }));
              
              // 找到未来的截止时间
              const futureDeadlines = allDeadlines.filter(t => t.time.isAfter(now));
              
              if (futureDeadlines.length > 0) {
                // 按时间排序，取最近的一个
                futureDeadlines.sort((a, b) => a.time.diff(b.time));
                upcomingDeadline = futureDeadlines[0];
                deadline = upcomingDeadline.time;
                comment = upcomingDeadline.comment;
                remain = deadline.diff(now);
                status = 'RUN';
              } else {
                // 检查是否所有截止时间都已过期
                const hasDeadlines = allDeadlines.length > 0;
                if (hasDeadlines) {
                  status = 'FIN';
                } else {
                  status = 'TBD';
                }
              }
            }
            
            // 格式化中文时间显示
            let chineseDeadline = 'TBD';
            if (deadline) {
              const localTime = deadline.tz(this.timeZone);
              const year = localTime.year();
              const month = localTime.month() + 1;
              const day = localTime.date();
              const hour = localTime.hour();
              const minute = localTime.minute();
              
              // 检查是否有具体的时分信息（不是00:00）
              if (hour === 0 && minute === 0) {
                chineseDeadline = `${year}年${month}月${day}日`;
              } else {
                chineseDeadline = `${year}年${month}月${day}日 ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              }
            }

            const flatEvent = {
              // Group info
              title: group.title,
              description: group.description,
              category: group.category,
              tags: group.tags || [],
              // Event info
              ...event,
              // Processed info
              status: status,
              remain: remain,
              deadline: deadline,
              comment: comment,
              isLike: this.cachedLikes && this.cachedLikes.indexOf(event.id) >= 0,
              chineseDeadline: chineseDeadline,
              localDDL: deadline ? deadline.tz(this.timeZone).format('ddd MMM Do YYYY HH:mm:ss z') : 'TBD',
              originDDL: upcomingDeadline ? `${upcomingDeadline.deadline} ${event.timezone}` : 'TBD',
            };
            
            processedEvents.push(flatEvent);
            if (flatEvent.tags) {
              flatEvent.tags.forEach(tag => this.allTags.add(tag));
            }
          }
        }
      }
      this.allEvents = processedEvents;
    },

    // --- UI Update ---
    updateDisplay() {
      let filteredList = this.allEvents;

      // Filter by Category
      if (this.selectedCategories.length > 0 && this.selectedCategories.length < this.categories.length) {
        filteredList = filteredList.filter(e => this.selectedCategories.includes(e.category));
      }

      // Filter by Tags
      if (this.selectedTags.length > 0) {
        filteredList = filteredList.filter(e => e.tags.some(tag => this.selectedTags.includes(tag)));
      }

      // Filter by Search Input
      if (this.input) {
        const lowerInput = this.input.toLowerCase();
        filteredList = filteredList.filter(e => 
          e.title.toLowerCase().includes(lowerInput) || 
          e.id.toLowerCase().includes(lowerInput)
        );
      }

      // Sort
      const runList = filteredList.filter(e => e.status === 'RUN').sort((a, b) => a.remain - b.remain);
      const tbdList = filteredList.filter(e => e.status === 'TBD');
      const finList = filteredList.filter(e => e.status === 'FIN').sort((a, b) => b.year - a.year);
      
      let sortedList = [...runList, ...tbdList, ...finList];

      // Handle Likes
      const likedList = [];
      const unlikedList = [];
      for (const item of sortedList) {
        if (item.isLike) {
          likedList.push(item);
        } else {
          unlikedList.push(item);
        }
      }
      const finalList = [...likedList, ...unlikedList];

      this.showNumber = finalList.length;
      this.showList = finalList.slice(this.pageSize * (this.page - 1), this.pageSize * this.page);
    },

    // --- Event Handlers ---
    handleCheckAllChange(val) {
      this.selectedCategories = val ? this.categories.map(c => c.id) : [];
      this.isIndeterminate = false;
      this.page = 1;
      this.updateDisplay();
    },
    handleCategoryChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.categories.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.categories.length;
      this.page = 1;
      this.updateDisplay();
    },
    handleTagChange() {
      this.page = 1;
      this.updateDisplay();
    },
    handleInputChange() {
      this.page = 1;
      this.updateDisplay();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.updateDisplay();
    },
    handleClickIcon(record) {
      record.isLike = !record.isLike;
      if (record.isLike) {
        this.cachedLikes.push(record.id);
      } else {
        const index = this.cachedLikes.indexOf(record.id);
        if (index > -1) this.cachedLikes.splice(index, 1);
      }
      this.$ls.set('likes', Array.from(new Set(this.cachedLikes)));
      this.updateDisplay(); // Re-sort to bring liked items to top
    },
    
    toggleCategory(categoryId) {
      const index = this.selectedCategories.indexOf(categoryId);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      } else {
        this.selectedCategories.push(categoryId);
      }
      this.page = 1;
      this.updateDisplay();
    },

    // --- Helpers ---
    transform(props) {
      Object.entries(props).forEach(([key, value]) => {
        const digits = value < 10 ? `0${value}` : value;
        const word = value < 2 ? key.replace(/s$/, '') : key;
        props[key] = (word[0] === 'd') ? `${digits} ${word}` : `${digits} ${word[0]}`;
      });
      return props;
    },
    formatGoogleCalendar(row) {
      if (!row.deadline) return "#";
      const gcalTime = (t) => t.toISOString().replace(/-|:|\.\d\d\d/g, "");
      return `https://www.google.com/calendar/render?action=TEMPLATE&text=${row.title}+${row.year}&dates=${gcalTime(row.deadline)}/${gcalTime(row.deadline)}&details=${row.comment}&location=${row.place}&ctz=${this.timeZone}&sf=true&output=xml`;
    },
    formatiCloudCalendar(row) {
      if (!row.deadline) return "#";
      const icalTime = (t) => t.toISOString().replace(/-|:|\.\d\d\d/g, "");
      return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0AURL:${row.link}%0ADTSTART:${icalTime(row.deadline)}%0ADTEND:${icalTime(row.deadline)}%0ASUMMARY:${row.title} ${row.year} Deadline%0ADESCRIPTION:${row.comment}%0ALOCATION:${row.place}%0AEND:VEVENT%0AEND:VCALENDAR`;
    },
    _isMobile() {
      return /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile/i.test(navigator.userAgent);
    },
    formatCategoryName(item) {
      return this._isMobile() ? item.id.toUpperCase() : item.name;
    },

    getRowClassName({row}) {
      let className = '';
      if (row.status === 'FIN') {
        className += 'finished-row ';
      }
      if (row.remain < 86400000 && row.status === 'RUN') {
        className += 'urgent-row ';
      }
      return className.trim();
    },

    // --- Local Storage ---
    loadCachedLikes() {
      this.cachedLikes = this.$ls.get('likes') || [];
    },
  },
  mounted() {
    this.loadData();
  }
}
</script>

<style scoped>
/* 全局容器 */
.modern-container {
  min-height: 100vh;
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  width: 100vw;
  overflow-x: hidden;
}

/* 英雄区域 */
.hero-section {
  background: #ffffff;
  padding: 30px 20px;
  text-align: center;
  color: #2d3748;
  position: relative;
  border-bottom: 1px solid #e2e8f0;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.gradient-text {
  color: #1a202c;
  display: block;
}

.hero-subtitle {
  display: block;
  font-size: 1rem;
  font-weight: 400;
  margin-top: 0.3rem;
  color: #718096;
}

.hero-description {
  font-size: 0.95rem;
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
}

.stat-label {
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.3rem;
}

/* 筛选区域 */
.filter-section {
  background: #ffffff;
  padding: 1.2rem 2rem;
  margin: 0;
  border-bottom: 1px solid #e2e8f0;
}

.filter-container {
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
}

.search-box {
  position: relative;
  margin-bottom: 1.2rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem 0.8rem 0.8rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
  background: #ffffff;
}

.search-input:focus {
  outline: none;
  border-color: #6b7280;
}

.search-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1rem;
}

.filter-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.8rem;
}

.category-filters {
  margin-bottom: 1.2rem;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-chip {
  padding: 0.4rem 0.8rem;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 400;
  color: #374151;
  font-size: 0.85rem;
}

.category-chip:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.category-chip.active {
  background: #374151;
  color: white;
  border-color: #374151;
}

.tag-filters {
  margin-bottom: 0.5rem;
}

.tag-select {
  width: 100%;
  max-width: 300px;
}

/* 事件区域 */
.events-section {
  padding: 2rem;
  width: 100%;
  margin: 0 auto;
}

.table-container {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  margin-bottom: 2rem;
}

/* 现代化表格样式 */
.modern-table {
  border-radius: 8px;
}

.modern-table .el-table__header-wrapper {
  background: #f7fafc;
}

.modern-table .el-table__header th {
  background: transparent !important;
  color: #4a5568 !important;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0 !important;
  padding: 1rem 0.8rem;
  font-size: 0.9rem;
}

.modern-table .el-table__body tr {
  transition: all 0.3s ease;
}

.modern-table .el-table__body tr:hover {
  background: #f8fafc !important;
}

.modern-table .el-table__body td {
  border: none !important;
  padding: 1rem 0.8rem;
  vertical-align: middle;
  height: 80px;
}

/* 行状态样式 */
.modern-table .el-table__body .urgent-row {
  background: #fef2f2 !important;
  border-left: 4px solid #ef4444;
}

.modern-table .el-table__body .finished-row {
  background: #f8fafc !important;
  opacity: 0.7;
}

/* 标题单元格 */
.title-cell {
  margin-bottom: 0.5rem;
}

.title-link {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  line-height: 1.3;
  transition: color 0.3s ease;
  display: block;
  margin-bottom: 0.3rem;
}

.title-link:hover {
  color: #667eea;
}

.description-text {
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.4;
}

/* 收藏图标 */
.star-icon {
  font-size: 1.3rem;
  cursor: pointer;
  color: #cbd5e1;
  transition: all 0.3s ease;
}

.star-icon:hover {
  color: #fbbf24;
  transform: scale(1.2);
}

.star-icon.liked {
  color: #fbbf24;
}

/* 分类徽章 */
.category-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-left: 0.5rem;
  border: 1px solid;
}

.category-badge.conference {
  background: #eff6ff;
  color: #1d4ed8;
  border-color: #bfdbfe;
}

.category-badge.competition {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.category-badge.activity {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

/* 地点信息 */
.location-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
  font-size: 0.85rem;
}

.info-item i {
  color: #667eea;
  font-size: 0.9rem;
  width: 14px;
}

/* 标签单元格 */
.tags-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
}

.tag-chip {
  padding: 0.3rem 0.6rem;
  background: #f9fafb;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 400;
}

.more-tags {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 400;
  padding: 0.3rem 0.6rem;
  background: #f3f4f6;
  border-radius: 4px;
}

/* 截止时间单元格 */
.deadline-cell {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.next-step-hint {
  font-size: 0.7rem;
  color: #059669;
  font-weight: 500;
  background: #ecfdf5;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #a7f3d0;
  text-align: center;
  margin-bottom: 0.2rem;
}

.deadline-text {
  font-size: 0.85rem;
  color: #1e293b;
  font-weight: 500;
}

.comment-text {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: #92400e;
  background: #fef3c7;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
}

/* 状态文本 */
.tbd-status {
  color: #92400e;
  font-weight: 500;
  font-size: 0.85rem;
}

.finished-status {
  color: #64748b;
  font-weight: 500;
  font-size: 0.85rem;
}

/* 倒计时单元格 */
.countdown-cell {
  text-align: center;
}

.countdown-compact {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.countdown-part {
  font-size: 0.8rem;
  font-weight: 600;
  color: #667eea;
  background: #f0f4ff;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
}

.status-text {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  text-align: center;
}

.status-text.tbd {
  background: #fef3c7;
  color: #92400e;
}

.status-text.finished {
  background: #f1f5f9;
  color: #64748b;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 0.3rem;
  justify-content: center;
}

.action-btn {
  padding: 0.4rem;
  border-radius: 6px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.action-btn.google {
  background: #4285f4;
}

.action-btn.icloud {
  background: #007aff;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 分页 */
.pagination-section {
  display: flex;
  justify-content: center;
  margin: 3rem 0;
}

.modern-pagination {
  background: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* 页脚 */
.modern-footer {
  background: #1e293b;
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.footer-info {
  margin-bottom: 1.5rem;
}

.footer-info p {
  margin: 0.5rem 0;
  opacity: 0.9;
}

.footer-info a {
  color: #667eea;
  text-decoration: none;
}

.footer-info a:hover {
  color: #4f46e5;
}

.footer-note {
  opacity: 0.7;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .filter-section {
    margin: -1rem 1rem 1rem;
    padding: 1.5rem;
  }
  
  .category-chips {
    justify-content: center;
  }
  
  .countdown-grid {
    gap: 0.5rem;
  }
  
  .countdown-item {
    padding: 0.8rem;
    min-width: 50px;
  }
  
  .deadline-info {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .events-section {
    padding: 1rem;
  }
  
  .event-card {
    padding: 1.5rem;
  }
}
</style>
