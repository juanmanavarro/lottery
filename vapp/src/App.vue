<template>
<div>
  <div class="flex justify-end">
    <button v-if="account" @click="disconnectWallet">
      {{ balance }} ETH
    </button>
    <button v-else @click="connectWallet">
      <span>Connect wallet</span>
    </button>
  </div>
  <div style="max-width:800px" class="pt-40 mx-auto">
    <div v-if="isConnected" id="app">
      <div class="card">
        <h4>Total</h4>
        <h2 class="-mt-3">56,444.56</h2>
      </div>
      <div class="card">
        <h4>Search number</h4>
        <input class="inline-block" v-model="number" type="text" maxlength="5">
        <button @click="add" :disabled="!canAdd">Add</button>
        <div v-if="numbers.length" class="mt-10">
          <code
            v-for="num in numbers"
            :key="num"
            class="number"
            :class="{ 'border-red-500': numbers.includes(num) }"
          >{{ num }}</code>
        </div>
        <div class="mt-10" v-if="numbers.length">
          <button>Purchase</button>
        </div>
      </div>
    </div>

    <div v-else>
      Check metamask
    </div>
  </div>
</div>
</template>

<script>
// import { mapState } from 'vuex';
import { ethers } from "ethers";

export default {
  name: 'app',
  data() {
    return {
      number: '',
      numbers: [],
      account: null,
      accounts: [],
      balance: 0,
      provider: null,
      connected: false,
    }
  },
  computed: {
    // ...mapGetters('drizzle', ['isDrizzleInitialized']),
    // ...mapState('accounts', ['activeAccount', 'activeBalance']),
    canAdd() {
      return this.number.length === 5 && !this.numbers.includes(this.number);
    },
    isConnected() {
      return Boolean(this.account);
    },
  },
  methods: {
    add() {
      this.numbers.push(this.number)
      this.number = '';
    },
    async connectWallet() {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.account = accounts[0];
        this.balance = ethers.utils.formatEther(await window.ethereum.request({
          method: 'eth_getBalance',
          params: [this.account],
        }));
      } catch (error) {
        console.error(error);
      }
    },
    async disconnectWallet() {
      this.account = null;
    },
  },
  mounted() {
    this.connectWallet();

    window.ethereum.on('chainChanged', async () => {
      this.balance = ethers.utils.formatEther(await window.ethereum.request({
        method: 'eth_getBalance',
        params: [this.account],
      }));
    });
  },
}
</script>
