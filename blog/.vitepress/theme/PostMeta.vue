<script setup>
import { useData } from 'vitepress'
import { computed, ref, onMounted, watch, nextTick } from 'vue'

const { frontmatter, page } = useData()

// Only render a byline when the page declares an author (i.e. it's an article).
const show = computed(() => !!frontmatter.value.author && !!frontmatter.value.date)

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const formattedDate = computed(() => {
  const raw = frontmatter.value.date
  if (!raw) return ''
  const d = new Date(raw)
  if (isNaN(d.getTime())) return String(raw)
  // Use UTC parts so an ISO date like 2026-06-01 never shifts a day across timezones.
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
})

const root = ref(null)
const ready = ref(false)
const readingTime = ref(0)

function position() {
  if (!show.value) return
  const doc = document.querySelector('.vp-doc')
  if (!doc) return

  // Reading time from the rendered article body (~200 wpm).
  const words = (doc.innerText || '').trim().split(/\s+/).filter(Boolean).length
  readingTime.value = Math.max(1, Math.round(words / 200))

  // Move the byline directly beneath the article's H1 title.
  const h1 = doc.querySelector('h1')
  if (h1 && root.value && root.value.previousElementSibling !== h1) {
    h1.insertAdjacentElement('afterend', root.value)
  }
  ready.value = true
}

onMounted(position)
// Re-run on client-side route changes between posts.
watch(() => page.value.relativePath, () => {
  ready.value = false
  readingTime.value = 0
  nextTick(position)
})
</script>

<template>
  <div v-if="show" ref="root" class="post-meta" :class="{ ready }">
    <span class="post-meta-author">{{ frontmatter.author }}</span>
    <span class="post-meta-sep">·</span>
    <time class="post-meta-date">{{ formattedDate }}</time>
    <template v-if="readingTime">
      <span class="post-meta-sep">·</span>
      <span class="post-meta-read">{{ readingTime }} min read</span>
    </template>
  </div>
</template>

<style scoped>
.post-meta {
  /* Hidden until positioned under the H1 to avoid a layout flash above the title. */
  display: none;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 12px 0 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 14px;
  line-height: 1.4;
  color: var(--vp-c-text-2);
}
.post-meta.ready {
  display: flex;
}
.post-meta-author {
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.post-meta-sep {
  opacity: 0.5;
}
</style>
