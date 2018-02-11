<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click.stop.prevent="toggoleFavorite">
          <span class="icon icon-favorite" :class="{'active': favorite}"></span><span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <div class="content">{{seller.bulletin}}</div>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item" v-for="(item, index) in seller.supports" :key="index">
            <span class="icon" :class="classMap[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic, index) in seller.pics" :key="index">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item" v-for="(info, index) in seller.infos" :key="index">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Star from '../star/star';
  import Split from './../../components/split/split';
  import BetterScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from '../../common/js/localstore';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite');
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    watch: {
      seller() {
        this._initPicScroll();
      }
    },
    mounted() {
      this.scroll = new BetterScroll(this.$refs.seller, {
        click: true
      });
      this._initPicScroll();
    },
    methods: {
      _initPicScroll() {
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin + 'px';
          this.$refs.picList.style.width = width;
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BetterScroll(this.$refs.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical' // 忽略外层区块竖向
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      },
      toggoleFavorite(event) {
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      }
    },
    components: {Star, Split, BetterScroll}
  };
</script>

<style lang="less">
  @import "./../../common/less/mixin";
  .seller {
    position: absolute;
    top:174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      padding: 18px;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7,17,27);
        font-size: 14px;
      }
      .desc {
        padding-bottom: 18px;
        line-height: 18px;
        .border-1px(rgba(7,17,27,.1));
        font-size: 0;
        .star {
          display: inline-block;
          margin-right: 8px;
          vertical-align: top;
        }
        .text {
          display: inline-block;
          vertical-align: top;
          line-height: 18px;
          color: rgb(77,85,93);
          font-size: 10px;
        }
      }
      .remark {
        display: flex;
        padding-top: 18px;
        .block {
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(7,17,27,.1);
          &:last-child {
            border: none;
          }
          h2{
            margin-bottom: 4px;
            line-height: 10px;
            font-size: 10px;
            color: rgb(147,153,159);
          }
          .content {
            line-height: 24px;
            font-size: 10px;
            color: rgb(7,17,27);
            .stress {
              font-size: 24px;
            }
          }
        }
      }
      .favorite {
        position: absolute;
        width: 50px;
        right: 11px;
        top:18px;
        text-align: center;
        .icon {
          display: block;
          color: #d4d6d9;
          font-size: 24px;
          &.active {
            color: red;
          }
        }
        .text {
          line-height: 10px;
          color: rgb(77,83,89);
          font-size: 10px;
        }
      }
    }
    .bulletin {
      padding: 18px 18px 0 18px;
      .title {
        margin-bottom: 8px;
        line-height: 14px;
        color: rgb(7,17,27);
        font-size: 14px;
      }
      .content-wrapper {
        padding: 0 12px 16px 12px;
        .content {
          line-height: 24px;
          color: rgb(240, 20, 20);
          font-size: 12px;
        }
      }
      .supports{
        .support-item {
          padding: 16px 12px;
          font-size: 0;
          .border-1px();
          &:last-child{
            &:after{border: none;}
          }
        }
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 16px;
          height: 16px;
          margin-right: 6px;
          background-size: 16px 16px;
          background-repeat: no-repeat;
          &.decrease {
            .seller-bg-image('decrease_4');
          }
          &.discount {
            .seller-bg-image('discount_4');
          }
          &.invoice {
            .seller-bg-image('invoice_4');
          }
          &.special {
            .seller-bg-image('special_4');
          }
          &.guarantee {
            .seller-bg-image('guarantee_4');
          }
        }
        .text {
          display: inline-block;
          vertical-align: top;
          line-height: 16px;
          color: rgb(7,17,27);
          font-size: 12px;
        }
      }
    }
    .pics {
      padding: 18px;
      .title {
        margin-bottom: 12px;
        line-height: 14px;
        color: rgb(7,17,27);
        font-size: 14px;
      }
      .pic-wrapper {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        .pic-list {
          font-size: 0;
          .pic-item {
            display: inline-block;
            margin-right: 6px;
            width: 120px;
            height: 90px;
            &:last-child{
              margin-right: 0;
            }
          }
        }
      }
    }
    .info {
      padding: 18px 18px 0 18px;
      color: rgb(7,17,27);
      .title {
        padding-bottom: 8px;
        line-height: 14px;
        font-size: 14px;
        .border-1px();
      }
      .info-item {
        padding: 16px 12px;
        line-height: 16px;
        font-size: 12px;
        .border-1px();
        &:last-child {
          &:after{
            border: none;
          }
        }
      }
    }
  }
</style>
