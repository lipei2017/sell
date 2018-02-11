<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <div class="content">
      <keep-alive>
      <router-view :seller="seller"></router-view>
      </keep-alive>
    </div>
    <!--<router-view/>-->
  </div>
</template>

<script>
  import Header from './components/header/header';
  import {urlParse} from './common/js/util';
  const ERR_OK = 0;
  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            console.log(queryParam);
            return queryParam.id;
          })()
        }
      };
    },
    created() {
      this.$http.get('/api/seller?id=').then(res => {
        console.log(res);
        res = res.data;
        if (res.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, res.data);
          console.log(this.seller);
        } else {}
      }, (err) => {
        console.log(err);
      });
    },
    components: {'v-header': Header}
  };
</script>

<style lang="less" rel="stylesheet">
  @import "common/less/mixin";

  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    .border-1px();
    .tab-item {
      flex: 1;
      text-align: center;
      & > a {
        display: block;
        font-size: 14px;
        color: rgb(77, 85, 93);
        &.active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
</style>
