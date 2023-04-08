import {AuthParams} from "@/utils/authentication"
import {useEffect, useMemo} from "react"
import {useRequest} from "ahooks"
import {fetchUserRoutes} from "@/service/api"
import {useDispatch, useSelector} from "react-redux"
import {GlobalState} from "@/store"
import registerGlobalFunction from "@/utils/registerGlobalFunction"
import {componentMount} from "@/routes/helpers"
import {isArray} from "@/utils/is"

export type IRoute = AuthParams & {
    name: string;
    breadcrumb?: boolean;
    children?: IRoute[];
    // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
    ignore?: boolean;
    // 路由地址
    path?: string;
    // 路由组件
    component?: string;
    meta?: {
        // 菜单图标
        icon?: string;
        // 菜单标题
        title?: string;
        // 菜单是否隐藏
        hide?: boolean;
    }
};

export const staticRoutes: IRoute[] = [
    // {
    //     name: "menu.dashboard",
    //     meta: {
    //         icon: "dashboard",
    //         title: "控制台",
    //     },
    //     children: [
    //         {
    //             name: "menu.dashboard.workplace",
    //             path: "/dashboard/workplace",
    //             component: "dashboard/workplace",
    //             meta: {
    //                 title: "工作台",
    //             }
    //         },
    //     ],
    // },
]

const useRoute = (): [IRoute[], string] => {
    const {routes} = useSelector((state: GlobalState) => state)
    const dispatch = useDispatch()

    const dynamicRoutes = useRequest(fetchUserRoutes, {
        manual: true,
        cacheKey: "app-dynamic-routes",
        onSuccess: async ({data}) => {
            if (!isArray(data)) return
            dispatch({
                type: "update-routes",
                payload: {
                    routes: await componentMount([...staticRoutes, ...data])
                },
            })
        }
    })

    registerGlobalFunction("refreshRoutes", () => dynamicRoutes.run())

    useEffect(() => {
        dynamicRoutes.run()
    }, [])

    const defaultRoute = useMemo(() => {
        const first = routes.find(r => r.is_home == 1) || routes[0]
        if (first) {
            const _path = first?.children?.[0]?.path || first.path

            return _path?.replace(/^\//, "")
        }
        return ""
    }, [routes])

    return [routes, defaultRoute]
}

export default useRoute
