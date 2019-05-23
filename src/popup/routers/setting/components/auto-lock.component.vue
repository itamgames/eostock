<template>
    <div class="lock">
        <h6 class="h-gap-15 align-left">{{ $t('setting').lockTitle }}</h6>
        <div class="pannel">
            <div class="script-box">
                {{ $t('setting').lockScript }}
            </div>
            <div class="select">
                <button type="button" class="select-selected"
                        :class="{ on: lockToggleList }"
                        @click="lockToggleList = !lockToggleList">
                    {{ selectedAutoLock.name }}
                    <i class="icon-arrow-down"></i>
                </button>
                <ul class="select-list" :class="{ on: lockToggleList }">
                    <li v-for="(autoLock, key) in autoLockList" :key="key">
                        <button type="button"
                                class="btn select"
                                :class="{ on: autoLock.value === autoLock.immediate }"
                                @click="autoLockSelect( autoLock )">
                            <span>{{ autoLock.name }}</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import modal from '../../../../common/components/modal/modal.component.vue';
import { AutoLock } from '../../../store/modules/setting/setting.interface';

@Component({
    components: {
        modal,
    },
})
export default class AutoLockSetting extends Vue {
    lockToggleList: boolean = false;
    autoLockList: any[] = [
        {name: 'never', value: 0},
        {name: '1 minuite', value: 1000 * 60},
        {name: '5 minuite', value: 1000 * 60 * 5},
        {name: '10 minuite', value: 1000 * 60 * 10},
        {name: '15 minuite', value: 1000 * 60 * 15},
        {name: '30 minuite', value: 1000 * 60 * 30},
        {name: '1 hour', value: 1000 * 60 * 60},
        {name: '2 hours', value: 1000 * 60 * 120},
        {name: '3 hours', value: 1000 * 60 * 180},
    ];

    selectedAutoLock: any = {
        name: 'never',
        value: 0,
    };

    created() {
        this.changeSelectedAutoLock(this.$store.getters.autoLock);
    }

    async autoLockSelect(autoLock: any) {
        if (this.selectedAutoLock.name !== autoLock.name) {
            await this.$store.dispatch('setAutoLock', autoLock.value);
            this.selectedAutoLock = autoLock;
        }
        this.lockToggleList = false;
    }

    changeSelectedAutoLock(autoLock: AutoLock) {
        this.selectedAutoLock = {...this.autoLockList
            .filter((auto) => auto.value === autoLock.immediate)[0]};
    }
}
</script>