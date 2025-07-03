import { useTimeout } from 'pota/use/time'
import styles from './index.module.css'

export default function Banner(props) {
	useTimeout(dispose, duration).start()

	function dispose() {
		props.setBanner(last => ({ ...last, message: '' }))
	}
	function duration() {
		return props.banner().duration * 1000
	}

	return (
		<div
			class={styles.banner}
			style:background-color={() => props.banner().backgroundColor}
			style:color={() => props.banner().color}
		>
			{() => props.banner().message}
		</div>
	)
}
