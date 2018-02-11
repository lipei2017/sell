<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span><span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <rating-select :select-type="selectType" :only-content="onlyContent"
                     :ratings="ratings" @ratingTypeSelect="ratingTypeSelect" @contentToggle="contentToggle"></rating-select>
      <div class="rating-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating, index) in ratings" class="rating-item" :key="index">
            <div class="avatar">
              <img width="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟到达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend.length">
                <span class="icon icon-thumb_up"></span>
                <span v-for="(item, index) in rating.recommend" :key="index" class="recommend-item">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BetterScroll from 'better-scroll';
  import Split from './../split/split';
  import RatingSelect from './../ratingselect/ratingselect';
  import {formatDate} from '../../common/js/date';
  import Star from './../star/star';
  const ALL = 2;
  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        showFlag: false,
        selectType: ALL,
        onlyContent: true
      };
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    created () {
      this.$http.get('/api/ratings').then((res) => {
        res = res.data;
        if (res.errno === ERR_OK) {
          this.ratings = res.data;
          if (!this.scroll) {
            this.$nextTick(() => {
              this.scroll = new BetterScroll(this.$refs.ratings, {
                click: true
              });
            });
          } else {
            this.scroll.refresh();
          }
        }
      });
    },
    methods: {
      ratingTypeSelect(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      contentToggle() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      }
    },
    components: {
      Star,
      Split,
      RatingSelect,
      BetterScroll
    }
  };
</script>

<style lang="less">
  @import "./../../common/less/mixin";
  .ratings {
    position: absolute;
    top:174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      display: flex;
      padding: 18px;
      .overview-left{
        flex:0 0 137px;
        width: 137px;
        padding-bottom: 6px;
        border-right: 1px solid rgba(7,17,27,0.1);
        text-align: center;
        @media only screen and (max-width: 320px) {
          flex: 0 0 120px;
          width: 120px;
        }
        .score{
          margin-bottom: 6px;
          line-height: 28px;
          font-size: 24px;
          color: rgb(255,153,0);
        }
        .title{
          margin-bottom: 8px;
          line-height: 12px;
          font-size: 12px;
          color: rgb(7,17,27);
        }
        .rank{
          line-height: 10px;
          color: rgb(147,153,159);
          font-size: 10px;
        }
      }
      .overview-right{
        flex: 1;
        padding: 6px 0 6px 24px;
        .score-wrapper {
          margin-bottom: 8px;
          font-size: 0;
          .title {
            display: inline-block;
            line-height: 18px;
            vertical-align: top;
            font-size: 12px;
            color: rgb(7,17,27);
          }
          .star {
            display: inline-block;
            margin: 0 12px;
            vertical-align: top;
            .star-item {
              margin-right: 2px;
              &:last-child{
                margin-right: 0;
              }
            }
          }
          .score {
            display: inline-block;
            line-height: 18px;
            vertical-align: top;
            font-size: 12px;
            color: rgb(255,153,0);
          }
        }
        .delivery-wrapper {
          font-size: 0;
          .title {
            font-size: 12px;
            color: rgb(7,17,27);
          }
          .delivery {
            margin-left: 12px;
            font-size: 12px;
            color: rgb(147,153,159);
          }
        }
      }
    }
    .rating-wrapper {
      padding: 0 18px;
      .rating-item{
        display: flex;
        padding: 18px 0;
        .border-1px();
        .avatar {
          flex: 0 0 28;
          width: 28px;
          margin-right: 12px;
          img {
            border-radius: 50%;
          }
        }
        .content{
          position: relative;
          flex: 1;
          .name {
            margin-bottom: 4px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(7,17,27);
          }
          .star-wrapper {
            margin-bottom: 6px;
            font-size: 0;
            .star {
              display: inline-block;
              vertical-align: top;
              margin-right: 6px;
            }
            .delivery {
              display: inline-block;
              vertical-align: top;
              line-height: 12px;
              font-size: 10px;
              color: rgb(147,153,159);
            }
          }
          .text {
            margin-top: 6px;
            line-height: 18px;
            font-size: 12px;
            color: rgb(7,17,27);
          }
          .recommend {
            margin-top: 8px;
            line-height: 16px;
            font-size: 0;
            .icon, .recommend-item {
              display: inline-block;
              vertical-align: top;
              margin: 0 8px 4px 0;
              font-size: 9px;
            }
            .icon {
              color: rgb(0,160,220)
            }
            .recommend-item {
              padding: 0 6px;
              border: 1px solid rgba(7,17,27,0.1);
              border-radius: 1px;
              font-size: 9px;
              color: rgb(147,153,159);
              overflow: hidden;
              text-align: center;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .time {
            position: absolute;
            right: 0;
            top: 0;
            font-size: 10px;
            color: rgb(147,153,159);
          }
        }
      }
    }
  }
</style>
