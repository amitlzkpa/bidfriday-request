<template>
  <div>    
    <button @click="refresh">Refresh</button>
    <p v-for="row in rows" :key="row.name">
      {{ row.name }}
    </p>
  </div>
</template>

<script>

let ctx;
let key_linkedBidBoard = "test3";

export default {
  data () {
    return {
      user: null,
      currBoardData: null,
      linkedBoardId: null,
      rows: []
    };
  },
  async mounted () {
    let res = await this.monday.api('query { me { id name country_code location url account { id name } } }');
    this.user = res.data.me;

    this.monday.listen("context", async (res) => {
      ctx = res.data;
    });

    this.refresh();

  },
  methods: {
    async refresh() {
      while(!ctx) await this.wait(200);

      let boardId = ctx.boardId;
      let queryStr = `query { boards (ids: ${boardId}) { id name items { name } } }`;
      let res = await this.monday.api(queryStr);
      this.currBoardData = res.data.boards[0];
      this.rows = this.currBoardData.items;

      await this.syncBidsBoard();
    },
    async syncBidsBoard() {
      while(!ctx) await this.wait(200);

      // let mutStr;
      let res;
      
      res = await this.monday.storage.instance.getItem(key_linkedBidBoard);
      this.linkedBoardId = res.data.value;

      // if linkedBoardId is not set, fetch from db

      await this.monday.storage.instance.setItem(key_linkedBidBoard, this.linkedBoardId);

      // sync data across both boards
      // for(let r of this.rows) {
      //   mutStr = `mutation { create_column (board_id: ${this.linkedBoardId}, title: "${r.name}", column_type: long_text) { id } }`;
      //   res = await this.monday.api(mutStr);
      // }

    }
  }
}
</script>

<style scoped>
</style>
