import React, { FC, useState, useCallback } from 'react';
import { useContainer } from 'unstated-next';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@material-ui/core';
import { useMergeState, useOverlayState } from 'utils/hooks';
import { Direction } from 'utils/query';
import { GetApp, Delete, MoreVert } from '@material-ui/icons';
import RemoveDialog from 'plugins/series/RemoveDialog';
import {
  ReleaseContainer,
  useGetReleases,
  useRemoveRelease,
  useUpdateRelease,
} from '../hooks/releases';
import { GetReleaseOptions, SortByRelease, Release } from '../types';

interface Props {
  showId: number;
  episodeId: number;
}

interface MenuState {
  anchorEl: HTMLButtonElement;
  release: Release;
}

const Releases: FC<Props> = ({ showId, episodeId }) => {
  const [{ releases }] = useContainer(ReleaseContainer);
  const [options] = useMergeState<GetReleaseOptions>({
    page: 0,
    perPage: 50,
    order: Direction.Desc,
    sortBy: SortByRelease.FirstSeen,
  });

  const [menuState, setMenuState] = useState<MenuState>();
  const { release: selectedRelease, anchorEl } = menuState ?? {};
  const [isRemoveOpen, { open: removeOpen, close: removeClose }] = useOverlayState();
  const handleMenuClose = useCallback(() => setMenuState(undefined), []);
  const handleMenuClick = useCallback(
    (release: Release, event: React.MouseEvent<HTMLButtonElement>) =>
      setMenuState({
        anchorEl: event.currentTarget,
        release,
      }),
    [],
  );

  useGetReleases(showId, episodeId, options);
  const [removeState, removeRelease] = useRemoveRelease(showId, episodeId, selectedRelease?.id);
  const [{ loading: updateLoading }, updateRelease] = useUpdateRelease(
    showId,
    episodeId,
    selectedRelease?.id,
  );

  return (
    <List dense>
      {releases.map(release => (
        <ListItem key={release.id}>
          <ListItemText primary={release.title} secondary={release.quality} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              onClick={e => handleMenuClick(release, e)}
              aria-label="View More"
            >
              <MoreVert />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
        <MenuItem onClick={updateRelease} disabled={updateLoading || !selectedRelease?.downloaded}>
          <ListItemIcon>
            <GetApp />
          </ListItemIcon>
          Reset Release
        </MenuItem>
        <MenuItem onClick={removeOpen}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          Delete Release
        </MenuItem>
      </Menu>
      <RemoveDialog
        open={isRemoveOpen}
        onClose={removeClose}
        state={removeState}
        request={removeRelease}
        name="Release"
      />
    </List>
  );
};

export default Releases;
