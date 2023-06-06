"""Panel and Websocket API."""
from __future__ import annotations

from typing import Final

from homeassistant.components import panel_custom
from homeassistant.core import HomeAssistant
from panel_package_name import entrypoint_js, is_dev_build, locate_dir

from .const import DOMAIN

URL_BASE: Final = "/panel_static"  # build-scripts/paths.cjs -> panel_publicPath


async def register_panel(hass: HomeAssistant) -> None:
    """Register the Panel."""
    if DOMAIN not in hass.data.get("frontend_panels", {}):
        hass.http.register_static_path(
            url_path=URL_BASE,
            path=locate_dir(),
            cache_headers=not is_dev_build,
        )
        await panel_custom.async_register_panel(
            hass=hass,
            frontend_url_path=DOMAIN,
            webcomponent_name="panel_frontend_name",  # custom element name from `main.ts`
            sidebar_title=DOMAIN.title(),
            sidebar_icon="mdi:human-greeting",
            module_url=f"{URL_BASE}/{entrypoint_js}",
            embed_iframe=True,
            require_admin=True,
        )
