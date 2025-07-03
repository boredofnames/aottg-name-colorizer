import { pd } from '@js/utils.js'
import chroma from 'chroma-js'
import { For } from 'pota/components'
import styles from './index.module.css'

export default function Colors(props) {
	function add(e) {
		props.colors.list.push(e.currentTarget.value)
	}
	function remove(index) {
		props.colors.list.splice(index, 1)
	}
	function getColor(color) {
		const wd = chroma.distance('#fff', color, 'rgb')
		const bd = chroma.distance('#000', color, 'rgb')

		return wd > bd ? 'white' : 'black'
	}

	return (
		<section>
			<h2>Colors</h2>
			<form on:submit={pd}>
				<input type="color" on:change={add} />
				<div class={styles.colors}>
					<For each={props.colors.list} reactiveIndex>
						{(color, i) => (
							<div
								class={styles.colorView}
								style:color={() => getColor(color)}
								style:background-color={color}
								on:click={() => remove(i())}
							>
								{i}
							</div>
						)}
					</For>
				</div>
			</form>
		</section>
	)
}
