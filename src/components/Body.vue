<template>
  <div>    
    <button @click="refresh">Refresh</button>
    <button v-if="linkedBoardId === null" @click="enableBidding">Enable Bidding</button>
    <span v-else>
      {{ linkedBoardId }}
      <button @click="deleteBidding">Delete Bidding</button>
    </span>
    <p v-for="row in rows" :key="row.name">
      {{ row.name }}
    </p>
  </div>
</template>

<script>

let ctx;
let key_linkedBidBoard = "test1";

export default {
  data () {
    return {
      currBoardData: null,
      linkedBoardId: null,
      rows: []
    };
  },
  async mounted () {

    this.monday.listen("context", async (res) => {
      ctx = res.data;
    });

    this.refresh();

  },
  methods: {
    async refresh() {
      while(!ctx) await this.wait(200);

      let boardId = ctx.boardId;
      let queryStr = `query { boards (ids: ${boardId}) { name items { name } } }`;
      let res = await this.monday.api(queryStr);
      this.currBoardData = res.data.boards[0];
      this.rows = this.currBoardData.items;
      
      res = await this.monday.storage.instance.getItem(key_linkedBidBoard);
      this.linkedBoardId = res.data.value;
    },
    async enableBidding() {
      while(!ctx) await this.wait(200);

      let mutStr;
      let res;

      mutStr = `mutation { create_board (board_name: "${this.currBoardData.name}[Bids]", board_kind: private) { id } }`;
      res = await this.monday.api(mutStr);

      this.linkedBoardId = res.data.create_board.id;

      for(let r of this.rows) {
        mutStr = `mutation { create_column (board_id: ${this.linkedBoardId}, title: "${r.name}", column_type: long_text) { id } }`;
        res = await this.monday.api(mutStr);
      }

      await this.monday.storage.instance.setItem(key_linkedBidBoard, this.linkedBoardId);

      await this.monday.execute("notice", { 
        message: "Enabled bidding for this request. Jump over to the bidding board to invite bidders.",
        type: "success",
        timeout: 10000,
      });

    },
    async deleteBidding() {
      let mutStr;
      let res;

      mutStr = `mutation { archive_board (board_id: ${this.linkedBoardId}) { id name } }`;
      res = await this.monday.api(mutStr);
      console.log(res.data);

      res = await this.monday.storage.instance.deleteItem(key_linkedBidBoard);
      console.log(res.data);

      this.linkedBoardId = null;
    }
  }
}
</script>

<style scoped>
</style>
