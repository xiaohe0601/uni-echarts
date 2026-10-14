<template>
  <div v-if="features.length > 0" class="SpecialSponsors">
    <VPFeatures :features="features"></VPFeatures>
  </div>
</template>

<script lang="ts" setup>
import { VPFeatures } from "vitepress/theme";
import { computed, reactive } from "vue";
import { useSpecialSponsors } from "../composables/useSpecialSponsors";

const props = defineProps<{
  tier: string;
}>();

const sponsors = reactive(useSpecialSponsors());

const features = computed(() => {
  if (sponsors.data == null) {
    return [];
  }

  const tierSponsors = sponsors.data.find((item) => item.tier === props.tier);

  if (tierSponsors == null) {
    return [];
  }

  return tierSponsors.items.map((item) => ({
    title: item.name,
    details: item.description,
    link: item.link,
    icon: {
      src: item.icon
    }
  }));
});
</script>

<style>
@keyframes platinum-surface {
  0%,
  100% {
    background-position: 0 50%, 0 0, 100% 100%;
  }

  50% {
    background-position: 100% 50%, 100% 100%, 0 0;
  }
}

@keyframes platinum-aura {
  to {
    transform: rotate(360deg);
  }
}

@keyframes platinum-flash {
  0%,
  18% {
    opacity: 0;
    transform: translateX(-62%) skewX(-16deg);
  }

  48% {
    opacity: 0.78;
    transform: translateX(62%) skewX(-16deg);
  }

  68%,
  100% {
    opacity: 0;
    transform: translateX(62%) skewX(-16deg);
  }
}

.SpecialSponsors {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  .VPFeatures {
    .VPFeature {
      position: relative;
      overflow: hidden;
      background-image: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.98) 0%,
        rgba(226, 232, 240, 0.78) 18%,
        rgba(255, 255, 255, 0.98) 34%,
        rgba(148, 163, 184, 0.38) 50%,
        rgba(255, 255, 255, 0.98) 68%,
        rgba(203, 213, 225, 0.76) 84%,
        rgba(255, 255, 255, 0.98) 100%
      ),
      radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.92), transparent 34%),
      radial-gradient(circle at 88% 82%, rgba(100, 116, 139, 0.24), transparent 38%);
      background-position: 0 50%, 0 0, 100% 100%;
      background-size: 300% 300%, 160% 160%, 160% 160%;
      border-color: rgba(148, 163, 184, 0.62);
      isolation: isolate;
      transition: border-color 0.3s ease, transform 0.3s ease;
      animation: platinum-surface 12s ease-in-out infinite;

      .box {
        align-items: center;
        text-align: center;
      }

      &::before {
        position: absolute;
        inset: -60%;
        z-index: -2;
        pointer-events: none;
        content: "";
        background-image: conic-gradient(
          from 0deg,
          transparent 0deg,
          rgba(255, 255, 255, 0.12) 40deg,
          rgba(255, 255, 255, 0.68) 78deg,
          transparent 124deg,
          rgba(100, 116, 139, 0.16) 190deg,
          transparent 244deg,
          rgba(255, 255, 255, 0.48) 300deg,
          transparent 360deg
        );
        opacity: 0.8;
        filter: blur(12px);
        transform: rotate(0deg);
        animation: platinum-aura 16s linear infinite;
      }

      &::after {
        position: absolute;
        inset: -20% -55%;
        z-index: -1;
        pointer-events: none;
        content: "";
        background-image: linear-gradient(
          112deg,
          transparent 34%,
          rgba(255, 255, 255, 0.08) 42%,
          rgba(255, 255, 255, 0.92) 49%,
          rgba(255, 255, 255, 0.12) 55%,
          transparent 64%
        );
        opacity: 0.72;
        transform: translateX(-62%) skewX(-16deg);
        animation: platinum-flash 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }

      &:hover {
        border-color: rgba(100, 116, 139, 0.82);
        transform: translateY(-3px) scale(1.005);
      }
    }
  }
}

.dark {
  .SpecialSponsors {
    .VPFeatures {
      .VPFeature {
        background-image: linear-gradient(
          135deg,
          rgba(15, 23, 42, 0.94) 0%,
          rgba(71, 85, 105, 0.78) 22%,
          rgba(15, 23, 42, 0.98) 42%,
          rgba(148, 163, 184, 0.46) 54%,
          rgba(15, 23, 42, 0.96) 72%,
          rgba(100, 116, 139, 0.62) 100%
        );
        border-color: rgba(203, 213, 225, 0.42);

        &::before {
          background-image: linear-gradient(
            112deg,
            transparent 30%,
            rgba(226, 232, 240, 0.06) 42%,
            rgba(226, 232, 240, 0.28) 49%,
            rgba(226, 232, 240, 0.04) 56%,
            transparent 70%
          );
          background-size: 220% 100%;
        }

        &:hover {
          border-color: rgba(226, 232, 240, 0.72);
        }
      }
    }
  }
}

.VPDocAside {
  .SpecialSponsors {
    margin-top: 10px;

    .VPFeatures {
      padding: 6px;

      .box {
        padding: 12px 20px;
      }
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .SpecialSponsors {
    .VPFeatures {
      .VPFeature {
        .box,
        .box::before,
        .box::after {
          animation: none;
        }
      }
    }
  }
}
</style>