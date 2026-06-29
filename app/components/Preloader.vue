<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const progress = ref(0)
const counterText = ref('0%')
const preloaderRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)

const scrambleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'

const scrambleText = (finalText: string, element: HTMLElement, duration: number) => {
  let frame = 0
  const totalFrames = duration * 60
  
  const tick = () => {
    frame++
    if (frame >= totalFrames) {
      element.innerText = finalText
      return
    }
    
    const progressRatio = frame / totalFrames
    const visibleCharsCount = Math.floor(progressRatio * finalText.length)
    
    let currentText = finalText.substring(0, visibleCharsCount)
    for (let i = visibleCharsCount; i < finalText.length; i++) {
      if (finalText[i] === ' ') {
        currentText += ' '
      } else {
        currentText += scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)]
      }
    }
    
    element.innerText = currentText
    requestAnimationFrame(tick)
  }
  tick()
}

onMounted(() => {
  if (textRef.value) {
    scrambleText('ISAQUE ARAUJO', textRef.value, 1.8)
  }

  // Simulate loader counting up
  const tl = gsap.timeline({
    onComplete: () => {
      // Dispatch finished event to reveal parent content
      window.dispatchEvent(new CustomEvent('preloader-finished'))
      
      // Wipe away animation
      gsap.to(preloaderRef.value, {
        yPercent: -100,
        duration: 1.1,
        ease: 'power4.inOut',
        onComplete: () => {
          if (preloaderRef.value) {
            preloaderRef.value.style.display = 'none'
          }
        }
      })
    }
  })

  tl.to(progress, {
    value: 100,
    duration: 2.2,
    ease: 'power2.out',
    onUpdate: () => {
      counterText.value = `${Math.floor(progress.value)}%`
    }
  })
})
</script>

<template>
  <div
    ref="preloaderRef"
    class="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-between p-8 md:p-16 select-none"
  >
    <!-- Top Row: Mono aesthetic -->
    <div class="w-full flex justify-between text-[11px] font-mono tracking-widest text-gray-500 uppercase">
      <span>portfolio / v1.0</span>
      <span>status / initializing</span>
    </div>

    <!-- Center: Scrambled Name -->
    <div class="flex flex-col items-center justify-center">
      <h1
        ref="textRef"
        class="text-4xl md:text-6xl font-display font-bold tracking-tighter text-white select-none min-h-[70px] uppercase"
      >
        ISAQUE ARAUJO
      </h1>
      <p class="text-[12px] font-mono tracking-widest text-brand-accent mt-4 uppercase">
        creative design & AI engineering
      </p>
    </div>

    <!-- Bottom Row: Counter & Progress bar -->
    <div class="w-full flex flex-col gap-4">
      <div class="w-full flex justify-between items-baseline">
        <span class="text-4xl md:text-6xl font-display font-medium text-white tabular-nums tracking-tighter">
          {{ counterText }}
        </span>
        <span class="text-[11px] font-mono tracking-widest text-gray-500 uppercase">
          loading assets
        </span>
      </div>
      <!-- Fine progress track -->
      <div class="w-full h-[1px] bg-gray-900 relative">
        <div 
          class="h-full bg-brand-accent transition-all duration-75"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>
