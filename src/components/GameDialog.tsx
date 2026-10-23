import {
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Rating,
    Switch,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Slider,
    Tooltip,
    Autocomplete,
} from '@mui/material';
import { type Game } from '../types';

type GameDialogProps = {
    open: boolean;
    game: Game;
    setGame: (game: Game) => void;
    editId: string | null;
    error: string;
    onSave: () => void;
    onClose: () => void;
};

export default function GameDialog({
    open,
    game,
    setGame,
    editId,
    error,
    onSave,
    onClose,
}: GameDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {editId !== null ? 'ゲームを編集' : 'ゲームを登録'}
            </DialogTitle>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
                <TextField
                    label="ゲームタイトル"
                    value={game.title}
                    onChange={(e) => setGame({ ...game, title: e.target.value })}
                />
                <Autocomplete
                    freeSolo
                    options={['Switch', 'PS5', 'PC', 'スマートフォン']}
                    value={game.platform}
                    onInputChange={(_, value) =>
                        setGame({ ...game, platform: value })
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="プラットフォーム" />
                    )}
                />
                <FormControl>
                    <FormLabel>プレイ状況</FormLabel>

                    <RadioGroup
                        row
                        value={game.status}
                        onChange={(e) => setGame({ ...game, status: e.target.value })}
                    >
                        <FormControlLabel
                            value="未プレイ"
                            control={<Radio />}
                            label="未プレイ"
                        />
                        <FormControlLabel
                            value="プレイ中"
                            control={<Radio />}
                            label="プレイ中"
                        />
                        <FormControlLabel
                            value="クリア"
                            control={<Radio />}
                            label="クリア"
                        />
                    </RadioGroup>
                </FormControl>
                <Box>
                    <FormLabel>評価</FormLabel>
                    <Rating
                        value={game.rating}
                        onChange={(_, newValue) => setGame({ ...game, rating: newValue })}
                    />
                </Box>
                <Box>
                    <FormLabel>プレイ時間：{game.playTime}時間</FormLabel>
                    <Tooltip title="これまでにプレイした合計時間を設定します">
                        <Slider
                            value={game.playTime}
                            onChange={(_, value) => setGame({ ...game, playTime: value as number })}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </Tooltip>
                </Box>
                <FormControlLabel
                    control={
                        <Switch
                            checked={game.favorite}
                            onChange={(e) => setGame({ ...game, favorite: e.target.checked })}
                        />
                    }
                    label="お気に入り"
                />
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

            </DialogContent>

            <DialogActions>
                <Button variant="contained" onClick={onSave}>
                    {editId !== null ? '更新' : '登録'}
                </Button>

                <Button onClick={onClose}>
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
}
